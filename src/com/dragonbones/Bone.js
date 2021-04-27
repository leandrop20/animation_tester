import { TransformObject } from './TransformObject';
import { Transform } from './Transform';

export class Bone extends TransformObject {

	constructor() {
		super();

		this._animationPose = new Transform();
        this._bones = [];
        this._slots = [];
	}

	static toString() {
        return "[class Bone]";
    }

    _onClear() {
        super._onClear();
        this.inheritTranslation = false;
        this.inheritRotation = false;
        this.inheritScale = false;
        this.ikBendPositive = false;
        this.ikWeight = 0;
        this.length = 0;
        this._transformDirty = 2 /* All */; // Update
        this._blendIndex = 0;
        this._cacheFrames = null;
        this._animationPose.identity();
        this._visible = true;
        this._ikChain = 0;
        this._ikChainIndex = 0;
        this._ik = null;
        this._bones.length = 0;
        this._slots.length = 0;
    }

	_updateGlobalTransformMatrix() {
        if (this._parent) {
            var parentRotation = this._parent.global.skewY; // Only inherit skew y.
            var parentMatrix = this._parent.globalTransformMatrix;
            if (this.inheritScale) {
                if (!this.inheritRotation) {
                    this.global.skewX -= parentRotation;
                    this.global.skewY -= parentRotation;
                }
                this.global.toMatrix(this.globalTransformMatrix);
                this.globalTransformMatrix.concat(parentMatrix);
                if (!this.inheritTranslation) {
                    this.globalTransformMatrix.tx = this.global.x;
                    this.globalTransformMatrix.ty = this.global.y;
                }
                this.global.fromMatrix(this.globalTransformMatrix);
            }
            else {
                if (this.inheritTranslation) {
                    var x = this.global.x;
                    var y = this.global.y;
                    this.global.x = parentMatrix.a * x + parentMatrix.c * y + parentMatrix.tx;
                    this.global.y = parentMatrix.d * y + parentMatrix.b * x + parentMatrix.ty;
                }
                if (this.inheritRotation) {
                    this.global.skewX += parentRotation;
                    this.global.skewY += parentRotation;
                }
                this.global.toMatrix(this.globalTransformMatrix);
            }
        }
        else {
            this.global.toMatrix(this.globalTransformMatrix);
        }
    }

    _computeIKA() {
        var ikGlobal = this._ik.global;
        var x = this.globalTransformMatrix.a * this.length;
        var y = this.globalTransformMatrix.b * this.length;
        var ikRadian = (Math.atan2(ikGlobal.y - this.global.y, ikGlobal.x - this.global.x) +
            this.offset.skewY -
            this.global.skewY * 2 +
            Math.atan2(y, x)) * this.ikWeight; // Support offset.
        this.global.skewX += ikRadian;
        this.global.skewY += ikRadian;
        this.global.toMatrix(this.globalTransformMatrix);
    }

    _computeIKB() {
        var parentGlobal = this._parent.global;
        var ikGlobal = this._ik.global;
        var x = this.globalTransformMatrix.a * this.length;
        var y = this.globalTransformMatrix.b * this.length;
        var lLL = x * x + y * y;
        var lL = Math.sqrt(lLL);
        var dX = this.global.x - parentGlobal.x;
        var dY = this.global.y - parentGlobal.y;
        var lPP = dX * dX + dY * dY;
        var lP = Math.sqrt(lPP);
        dX = ikGlobal.x - parentGlobal.x;
        dY = ikGlobal.y - parentGlobal.y;
        var lTT = dX * dX + dY * dY;
        var lT = Math.sqrt(lTT);
        var ikRadianA = 0;
        if (lL + lP <= lT || lT + lL <= lP || lT + lP <= lL) {
            ikRadianA = Math.atan2(ikGlobal.y - parentGlobal.y, ikGlobal.x - parentGlobal.x) + this._parent.offset.skewY; // Support offset.
            if (lL + lP <= lT) {
            }
            else if (lP < lL) {
                ikRadianA += Math.PI;
            }
        }
        else {
            var h = (lPP - lLL + lTT) / (2 * lTT);
            var r = Math.sqrt(lPP - h * h * lTT) / lT;
            var hX = parentGlobal.x + (dX * h);
            var hY = parentGlobal.y + (dY * h);
            var rX = -dY * r;
            var rY = dX * r;
            if (this.ikBendPositive) {
                this.global.x = hX - rX;
                this.global.y = hY - rY;
            }
            else {
                this.global.x = hX + rX;
                this.global.y = hY + rY;
            }
            ikRadianA = Math.atan2(this.global.y - parentGlobal.y, this.global.x - parentGlobal.x) + this._parent.offset.skewY; // Support offset.
        }
        ikRadianA = (ikRadianA - parentGlobal.skewY) * this.ikWeight;
        parentGlobal.skewX += ikRadianA;
        parentGlobal.skewY += ikRadianA;
        parentGlobal.toMatrix(this._parent.globalTransformMatrix);
        this._parent._transformDirty = 1 /* Self */;
        this.global.x = parentGlobal.x + Math.cos(parentGlobal.skewY) * lP;
        this.global.y = parentGlobal.y + Math.sin(parentGlobal.skewY) * lP;
        var ikRadianB = (Math.atan2(ikGlobal.y - this.global.y, ikGlobal.x - this.global.x) + this.offset.skewY -
            this.global.skewY * 2 + Math.atan2(y, x)) * this.ikWeight; // Support offset.
        this.global.skewX += ikRadianB;
        this.global.skewY += ikRadianB;
        this.global.toMatrix(this.globalTransformMatrix);
    }

    _setArmature(value) {
        if (this._armature == value) {
            return;
        }
        this._ik = null;
        var oldSlots = null;
        var oldBones = null;
        if (this._armature) {
            oldSlots = this.getSlots();
            oldBones = this.getBones();
            this._armature._removeBoneFromBoneList(this);
        }
        this._armature = value;
        if (this._armature) {
            this._armature._addBoneToBoneList(this);
        }
        if (oldSlots) {
            for (var i = 0, l = oldSlots.length; i < l; ++i) {
                var slot = oldSlots[i];
                if (slot.parent == this) {
                    slot._setArmature(this._armature);
                }
            }
        }
        if (oldBones) {
            for (var i = 0, l = oldBones.length; i < l; ++i) {
                var bone = oldBones[i];
                if (bone.parent == this) {
                    bone._setArmature(this._armature);
                }
            }
        }
    }

    _setIK(value, chain, chainIndex) {
        if (value) {
            if (chain == chainIndex) {
                var chainEnd = this._parent;
                if (chain && chainEnd) {
                    chain = 1;
                }
                else {
                    chain = 0;
                    chainIndex = 0;
                    chainEnd = this;
                }
                if (chainEnd == value || chainEnd.contains(value)) {
                    value = null;
                    chain = 0;
                    chainIndex = 0;
                }
                else {
                    var ancestor = value;
                    while (ancestor.ik && ancestor.ikChain) {
                        if (chainEnd.contains(ancestor.ik)) {
                            value = null;
                            chain = 0;
                            chainIndex = 0;
                            break;
                        }
                        ancestor = ancestor.parent;
                    }
                }
            }
        }
        else {
            chain = 0;
            chainIndex = 0;
        }
        this._ik = value;
        this._ikChain = chain;
        this._ikChainIndex = chainIndex;
        if (this._armature) {
            this._armature._bonesDirty = true;
        }
    }

    _update(cacheFrameIndex) {
        var self = this;
        self._blendIndex = 0;
        if (cacheFrameIndex >= 0) {
            var cacheFrame = self._cacheFrames[cacheFrameIndex];
            if (self.globalTransformMatrix == cacheFrame) {
                self._transformDirty = 0 /* None */;
            }
            else if (cacheFrame) {
                self._transformDirty = 2 /* All */; // For update children and ik children.
                self.globalTransformMatrix = cacheFrame;
            }
            else if (self._transformDirty == 2 /* All */ ||
                (self._parent && self._parent._transformDirty != 0 /* None */) ||
                (self._ik && self.ikWeight > 0 && self._ik._transformDirty != 0 /* None */)) {
                self._transformDirty = 2 /* All */; // For update children and ik children.
                self.globalTransformMatrix = self._globalTransformMatrix;
            }
            else if (self.globalTransformMatrix != self._globalTransformMatrix) {
                self._transformDirty = 0 /* None */;
                self._cacheFrames[cacheFrameIndex] = self.globalTransformMatrix;
            }
            else {
                self._transformDirty = 2 /* All */;
                self.globalTransformMatrix = self._globalTransformMatrix;
            }
        }
        else if (self._transformDirty == 2 /* All */ ||
            (self._parent && self._parent._transformDirty != 0 /* None */) ||
            (self._ik && self.ikWeight > 0 && self._ik._transformDirty != 0 /* None */)) {
            self._transformDirty = 2 /* All */; // For update children and ik children.
            self.globalTransformMatrix = self._globalTransformMatrix;
        }
        if (self._transformDirty != 0 /* None */) {
            if (self._transformDirty == 2 /* All */) {
                self._transformDirty = 1 /* Self */;
                if (self.globalTransformMatrix == self._globalTransformMatrix) {
                    /*self.global.copyFrom(self.origin).add(self.offset).add(self._animationPose);*/
                    self.global.x = self.origin.x + self.offset.x + self._animationPose.x;
                    self.global.y = self.origin.y + self.offset.y + self._animationPose.y;
                    self.global.skewX = self.origin.skewX + self.offset.skewX + self._animationPose.skewX;
                    self.global.skewY = self.origin.skewY + self.offset.skewY + self._animationPose.skewY;
                    self.global.scaleX = self.origin.scaleX * self.offset.scaleX * self._animationPose.scaleX;
                    self.global.scaleY = self.origin.scaleY * self.offset.scaleY * self._animationPose.scaleY;
                    self._updateGlobalTransformMatrix();
                    if (self._ik && self._ikChainIndex == self._ikChain && self.ikWeight > 0) {
                        if (self.inheritTranslation && self._ikChain > 0 && self._parent) {
                            self._computeIKB();
                        }
                        else {
                            self._computeIKA();
                        }
                    }
                    if (cacheFrameIndex >= 0 && !self._cacheFrames[cacheFrameIndex]) {
                        self.globalTransformMatrix = BoneTimelineData.cacheFrame(self._cacheFrames, cacheFrameIndex, self._globalTransformMatrix);
                    }
                }
            }
            else {
                self._transformDirty = 0 /* None */;
            }
        }
    }

    /**
     * @version DragonBones 3.0
     */
    invalidUpdate() {
        this._transformDirty = 2 /* All */;
    }

    /**
     * @version DragonBones 3.0
     */
    contains(child) {
        if (child) {
            if (child == this) {
                return false;
            }
            var ancestor = child;
            while (ancestor != this && ancestor) {
                ancestor = ancestor.parent;
            }
            return ancestor == this;
        }
        return false;
    }

    /**
     * @version DragonBones 3.0
     */
    getBones() {
        this._bones.length = 0;
        var bones = this._armature.getBones();
        for (var i = 0, l = bones.length; i < l; ++i) {
            var bone = bones[i];
            if (bone.parent == this) {
                this._bones.push(bone);
            }
        }
        return this._bones;
    }

    /**
     * @version DragonBones 3.0
     */
    getSlots() {
        this._slots.length = 0;
        var slots = this._armature.getSlots();
        for (var i = 0, l = slots.length; i < l; ++i) {
            var slot = slots[i];
            if (slot.parent == this) {
                this._slots.push(slot);
            }
        }
        return this._slots;
    }

    get ikChain() {
    	return this._ikChain;
    }

    get ikChainIndex() {
    	return this._ikChainIndex;
    }

    get ik() {
    	return this._ik;
    }

    get visible() {
    	return this._visible;
    }

    set visible(value) {
    	if (this._visible == value) {
            return;
        }
        this._visible = value;
        var slots = this._armature.getSlots();
        for (var i = 0, l = slots.length; i < l; ++i) {
            var slot = slots[i];
            if (slot._parent == this) {
                slot._updateVisible();
            }
        }
    }

    get slot() {
    	var slots = this._armature.getSlots();
        for (var i = 0, l = slots.length; i < l; ++i) {
            var slot = slots[i];
            if (slot.parent == this) {
                return slot;
            }
        }
        return null;
    }

}