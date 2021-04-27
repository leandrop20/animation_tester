import { TransformObject } from './TransformObject';
import { ColorTransform } from './ColorTransform';
import { Matrix } from './Matrix';
import { Armature } from './Armature';

export class Slot extends TransformObject {

	constructor() {
		super();

		this._colorTransform = new ColorTransform();
        this._ffdVertices = [];
        this._replacedDisplayDataSet = [];
        this._localMatrix = new Matrix();
        this._displayList = [];
        this._meshBones = [];
	}

	_onClear() {
        super._onClear();
        var disposeDisplayList = [];
        for (var i = 0, l = this._displayList.length; i < l; ++i) {
            var eachDisplay = this._displayList[i];
            if (eachDisplay != this._rawDisplay && eachDisplay != this._meshDisplay &&
                disposeDisplayList.indexOf(eachDisplay) < 0) {
                disposeDisplayList.push(eachDisplay);
            }
        }
        for (var i = 0, l = disposeDisplayList.length; i < l; ++i) {
            var eachDisplay = disposeDisplayList[i];
            if (eachDisplay instanceof Armature) {
                eachDisplay.dispose();
            }
            else {
                this._disposeDisplay(eachDisplay);
            }
        }
        if (this._meshDisplay && this._meshDisplay != this._rawDisplay) {
            this._disposeDisplay(this._meshDisplay);
        }
        if (this._rawDisplay) {
            this._disposeDisplay(this._rawDisplay);
        }
        this.inheritAnimation = true;
        this.displayController = null;
        this._colorDirty = false;
        this._ffdDirty = false;
        this._blendIndex = 0;
        this._zOrder = 0;
        this._pivotX = 0;
        this._pivotY = 0;
        this._displayDataSet = null;
        this._meshData = null;
        this._childArmature = null;
        this._rawDisplay = null;
        this._meshDisplay = null;
        this._cacheFrames = null;
        this._colorTransform.identity();
        this._ffdVertices.length = 0;
        this._replacedDisplayDataSet.length = 0;
        this._displayDirty = false;
        this._blendModeDirty = false;
        this._originDirty = false;
        this._transformDirty = false;
        this._displayIndex = 0;
        this._blendMode = 0 /* Normal */;
        this._display = null;
        this._localMatrix.identity();
        this._displayList.length = 0;
        this._meshBones.length = 0;
    }

    _isMeshBonesUpdate() {
        for (var i = 0, l = this._meshBones.length; i < l; ++i) {
            if (this._meshBones[i]._transformDirty != 0 /* None */) {
                return true;
            }
        }
        return false;
    }

    _updatePivot(rawDisplayData, currentDisplayData, currentTextureData) {
        this._pivotX = currentDisplayData.pivot.x;
        this._pivotY = currentDisplayData.pivot.y;
        if (currentDisplayData.isRelativePivot) {
            var scale = this._armature.armatureData.scale;
            var rect = currentTextureData.frame || currentTextureData.region;
            var width = rect.width * scale;
            var height = rect.height * scale;
            if (currentTextureData.rotated) {
                width = rect.height;
                height = rect.width;
            }
            this._pivotX *= width;
            this._pivotY *= height;
        }
        if (currentTextureData.frame) {
            this._pivotX += currentTextureData.frame.x;
            this._pivotY += currentTextureData.frame.y;
        }
        if (rawDisplayData && rawDisplayData != currentDisplayData) {
            this._pivotX += rawDisplayData.transform.x - currentDisplayData.transform.x;
            this._pivotY += rawDisplayData.transform.y - currentDisplayData.transform.y;
        }
    }

    _updateDisplay() {
        var prevDisplay = this._display || this._rawDisplay;
        var prevChildArmature = this._childArmature;
        if (this._displayIndex >= 0 && this._displayIndex < this._displayList.length) {
            this._display = this._displayList[this._displayIndex];
            if (this._display instanceof Armature) {
                this._childArmature = this._display;
                this._display = this._childArmature._display;
            }
            else {
                this._childArmature = null;
            }
        }
        else {
            this._display = null;
            this._childArmature = null;
        }
        var currentDisplay = this._display || this._rawDisplay;
        if (currentDisplay != prevDisplay) {
            this._onUpdateDisplay();
            if (prevDisplay) {
                this._replaceDisplay(prevDisplay);
            }
            else {
                this._addDisplay();
            }
            this._blendModeDirty = true;
            this._colorDirty = true;
        }
        // Update origin.
        if (this._displayDataSet && this._displayIndex >= 0 && this._displayIndex < this._displayDataSet.displays.length) {
            this.origin.copyFrom(this._displayDataSet.displays[this._displayIndex].transform);
            this._originDirty = true;
        }
        // Update meshData.
        this._updateMeshData(false);
        // Update frame.
        if (currentDisplay == this._rawDisplay || currentDisplay == this._meshDisplay) {
            this._updateFrame();
        }
        // Update child armature.
        if (this._childArmature != prevChildArmature) {
            if (prevChildArmature) {
                prevChildArmature._parent = null; // Update child armature parent.
                if (this.inheritAnimation) {
                    prevChildArmature.animation.reset();
                }
            }
            if (this._childArmature) {
                this._childArmature._parent = this; // Update child armature parent.
                if (this.inheritAnimation) {
                    if (this._childArmature.cacheFrameRate == 0) {
                        var cacheFrameRate = this._armature.cacheFrameRate;
                        if (cacheFrameRate != 0) {
                            this._childArmature.cacheFrameRate = cacheFrameRate;
                        }
                    }
                    // Child armature action.                        
                    var slotData = this._armature.armatureData.getSlot(this.name);
                    var actions = slotData.actions.length > 0 ? slotData.actions : this._childArmature.armatureData.actions;
                    if (actions.length > 0) {
                        for (var i = 0, l = actions.length; i < l; ++i) {
                            this._childArmature._bufferAction(actions[i]);
                        }
                    }
                    else {
                        this._childArmature.animation.play();
                    }
                }
            }
        }
    }

    _updateLocalTransformMatrix() {
        this.global.copyFrom(this.origin).add(this.offset).toMatrix(this._localMatrix);
    }

    _updateGlobalTransformMatrix() {
        this.globalTransformMatrix.copyFrom(this._localMatrix);
        this.globalTransformMatrix.concat(this._parent.globalTransformMatrix);
        this.global.fromMatrix(this.globalTransformMatrix);
    }

    _setArmature(value) {
        if (this._armature == value) {
            return;
        }
        if (this._armature) {
            this._armature._removeSlotFromSlotList(this);
        }
        this._armature = value;
        this._onUpdateDisplay();
        if (this._armature) {
            this._armature._addSlotToSlotList(this);
            this._addDisplay();
        }
        else {
            this._removeDisplay();
        }
    }

    _updateMeshData(isTimelineUpdate) {
        var prevMeshData = this._meshData;
        var rawMeshData = null;
        if (this._display && this._display == this._meshDisplay && this._displayIndex >= 0) {
            rawMeshData = (this._displayDataSet && this._displayIndex < this._displayDataSet.displays.length) ? this._displayDataSet.displays[this._displayIndex].mesh : null;
            var replaceDisplayData = (this._displayIndex < this._replacedDisplayDataSet.length) ? this._replacedDisplayDataSet[this._displayIndex] : null;
            var replaceMeshData = replaceDisplayData ? replaceDisplayData.mesh : null;
            this._meshData = replaceMeshData || rawMeshData;
        }
        else {
            this._meshData = null;
        }
        if (this._meshData != prevMeshData) {
            if (this._meshData && this._meshData == rawMeshData) {
                if (this._meshData.skinned) {
                    this._meshBones.length = this._meshData.bones.length;
                    for (var i = 0, l = this._meshBones.length; i < l; ++i) {
                        this._meshBones[i] = this._armature.getBone(this._meshData.bones[i].name);
                    }
                    var ffdVerticesCount = 0;
                    for (var i = 0, l = this._meshData.boneIndices.length; i < l; ++i) {
                        ffdVerticesCount += this._meshData.boneIndices[i].length;
                    }
                    this._ffdVertices.length = ffdVerticesCount * 2;
                }
                else {
                    this._meshBones.length = 0;
                    this._ffdVertices.length = this._meshData.vertices.length;
                }
                for (var i = 0, l = this._ffdVertices.length; i < l; ++i) {
                    this._ffdVertices[i] = 0;
                }
                this._ffdDirty = true;
            }
            else {
                this._meshBones.length = 0;
                this._ffdVertices.length = 0;
            }
            if (isTimelineUpdate) {
                this._armature.animation._updateFFDTimelineStates();
            }
        }
    }

    _update(cacheFrameIndex) {
        var self = this;
        self._blendIndex = 0;
        if (self._displayDirty) {
            self._displayDirty = false;
            self._updateDisplay();
        }
        if (!self._display) {
            return;
        }
        if (self._blendModeDirty) {
            self._blendModeDirty = false;
            self._updateBlendMode();
        }
        if (self._colorDirty) {
            self._colorDirty = false;
            self._updateColor();
        }
        if (self._meshData) {
            if (self._ffdDirty || (self._meshData.skinned && self._isMeshBonesUpdate())) {
                self._ffdDirty = false;
                self._updateMesh();
            }
            if (self._meshData.skinned) {
                return;
            }
        }
        if (self._originDirty) {
            self._originDirty = false;
            self._transformDirty = true;
            self._updateLocalTransformMatrix();
        }
        if (cacheFrameIndex >= 0) {
            var cacheFrame = self._cacheFrames[cacheFrameIndex];
            if (self.globalTransformMatrix == cacheFrame) {
                self._transformDirty = false;
            }
            else if (cacheFrame) {
                self._transformDirty = true;
                self.globalTransformMatrix = cacheFrame;
            }
            else if (self._transformDirty || self._parent._transformDirty != 0 /* None */) {
                self._transformDirty = true;
                self.globalTransformMatrix = self._globalTransformMatrix;
            }
            else if (self.globalTransformMatrix != self._globalTransformMatrix) {
                self._transformDirty = false;
                self._cacheFrames[cacheFrameIndex] = self.globalTransformMatrix;
            }
            else {
                self._transformDirty = true;
                self.globalTransformMatrix = self._globalTransformMatrix;
            }
        }
        else if (self._transformDirty || self._parent._transformDirty != 0 /* None */) {
            self._transformDirty = true;
            self.globalTransformMatrix = self._globalTransformMatrix;
        }
        if (self._transformDirty) {
            self._transformDirty = false;
            if (self.globalTransformMatrix == self._globalTransformMatrix) {
                self._updateGlobalTransformMatrix();
                if (cacheFrameIndex >= 0 && !self._cacheFrames[cacheFrameIndex]) {
                    self.globalTransformMatrix = SlotTimelineData.cacheFrame(self._cacheFrames, cacheFrameIndex, self._globalTransformMatrix);
                }
            }
            self._updateTransform();
        }
    }

    _setDisplayList(value) {
        if (value && value.length > 0) {
            if (this._displayList.length != value.length) {
                this._displayList.length = value.length;
            }
            for (var i = 0, l = value.length; i < l; ++i) {
                var eachDisplay = value[i];
                if (eachDisplay && eachDisplay != this._rawDisplay && eachDisplay != this._meshDisplay &&
                    !(eachDisplay instanceof Armature) && this._displayList.indexOf(eachDisplay) < 0) {
                    this._initDisplay(eachDisplay);
                }
                this._displayList[i] = eachDisplay;
            }
        }
        else if (this._displayList.length > 0) {
            this._displayList.length = 0;
        }
        if (this._displayIndex >= 0 && this._displayIndex < this._displayList.length) {
            this._displayDirty = this._display != this._displayList[this._displayIndex];
        }
        else {
            this._displayDirty = this._display != null;
        }
        return this._displayDirty;
    }

    _setDisplayIndex(value) {
        if (this._displayIndex == value) {
            return false;
        }
        this._displayIndex = value;
        this._displayDirty = true;
        return this._displayDirty;
    }

    _setBlendMode(value) {
        if (this._blendMode == value) {
            return false;
        }
        this._blendMode = value;
        this._blendModeDirty = true;
        return true;
    }
    
    _setColor(value) {
        this._colorTransform.copyFrom(value);
        this._colorDirty = true;
        return true;
    }

    /**
     * @version DragonBones 4.5
     */
    invalidUpdate() {
        this._displayDirty = true;
    }

    get rawDisplay() {
    	return this._rawDisplay;
    }

    get MeshDisplay() {
    	return this._meshDisplay;
    }

    get displayIndex() {
    	return this._displayIndex;
    }

    set displayIndex(value) {
    	if (this._setDisplayIndex(value)) {
            this._update(-1);
        }
    }

    get displayList() {
    	return this._displayList.concat();
    }

    set displayList(value) {
    	var backupDisplayList = this._displayList.concat(); // Copy.
        var disposeDisplayList = [];
        if (this._setDisplayList(value)) {
            this._update(-1);
        }
        // Release replaced render displays.
        for (var i = 0, l = backupDisplayList.length; i < l; ++i) {
            var eachDisplay = backupDisplayList[i];
            if (eachDisplay && eachDisplay != this._rawDisplay && eachDisplay != this._meshDisplay &&
                this._displayList.indexOf(eachDisplay) < 0 &&
                disposeDisplayList.indexOf(eachDisplay) < 0) {
                disposeDisplayList.push(eachDisplay);
            }
        }
        for (var i = 0, l = disposeDisplayList.length; i < l; ++i) {
            var eachDisplay = disposeDisplayList[i];
            if (eachDisplay instanceof Armature) {
                eachDisplay.dispose();
            }
            else {
                this._disposeDisplay(eachDisplay);
            }
        }
    }

    get display() {
    	return this._display;
    }

    set display(value) {
    	if (this._display == value) {
            return;
        }
        var displayListLength = this._displayList.length;
        if (this._displayIndex < 0 && displayListLength == 0) {
            this._displayIndex = 0;
        }
        if (this._displayIndex < 0) {
            return;
        }
        else {
            var replaceDisplayList = this.displayList; // Copy.
            if (displayListLength <= this._displayIndex) {
                replaceDisplayList.length = this._displayIndex + 1;
            }
            replaceDisplayList[this._displayIndex] = value;
            this.displayList = replaceDisplayList;
        }
    }

    get childArmature() {
    	return this._childArmature;
    }

    set childArmature(value) {
    	if (this._childArmature == value) {
            return;
        }
        if (value) {
            value.display.advanceTimeBySelf(false); // Stop child armature self advanceTime.
        }
        this.display = value;
    }

    getDisplay() {
        return this._display;
    }

    setDisplay(value) {
        this.display = value;
    }

}