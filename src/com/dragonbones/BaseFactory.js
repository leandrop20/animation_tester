import { DragonBones } from './DragonBones';
import { ObjectDataParser } from './ObjectDataParser';
import { BaseObject } from './BaseObject';
import { Bone } from './Bone';

export class BaseFactory {

	constructor(dataParser = null) {
		this.autoSearch = false;
        this._dataParser = null;
        this._dragonBonesDataMap = {};
        this._textureAtlasDataMap = {};
        this._dataParser = dataParser;
        
        if (!this._dataParser) {
            if (!BaseFactory._defaultParser) {
                BaseFactory._defaultParser = new ObjectDataParser();
            }
            this._dataParser = BaseFactory._defaultParser;
        }
	}

	_getTextureData(dragonBonesName, textureName) {
        var textureAtlasDataList = this._textureAtlasDataMap[dragonBonesName];
        if (textureAtlasDataList) {
            for (var i = 0, l = textureAtlasDataList.length; i < l; ++i) {
                var textureData = textureAtlasDataList[i].getTexture(textureName);
                if (textureData) {
                    return textureData;
                }
            }
        }
        if (this.autoSearch) {
            for (var i in this._textureAtlasDataMap) {
                textureAtlasDataList = this._textureAtlasDataMap[i];
                for (var j = 0, lJ = textureAtlasDataList.length; j < lJ; ++j) {
                    var textureAtlasData = textureAtlasDataList[j];
                    if (textureAtlasData.autoSearch) {
                        var textureData = textureAtlasData.getTexture(textureName);
                        if (textureData) {
                            return textureData;
                        }
                    }
                }
            }
        }
        return null;
    }
    
    _fillBuildArmaturePackage(dragonBonesName, armatureName, skinName, dataPackage) {
        if (dragonBonesName) {
            var dragonBonesData = this._dragonBonesDataMap[dragonBonesName];
            if (dragonBonesData) {
                var armatureData = dragonBonesData.getArmature(armatureName);
                if (armatureData) {
                    dataPackage.dataName = dragonBonesName;
                    dataPackage.data = dragonBonesData;
                    dataPackage.armature = armatureData;
                    dataPackage.skin = armatureData.getSkin(skinName);
                    if (!dataPackage.skin) {
                        dataPackage.skin = armatureData.defaultSkin;
                    }
                    return true;
                }
            }
        }
        if (!dragonBonesName || this.autoSearch) {
            for (var eachDragonBonesName in this._dragonBonesDataMap) {
                var dragonBonesData = this._dragonBonesDataMap[eachDragonBonesName];
                if (!dragonBonesName || dragonBonesData.autoSearch) {
                    var armatureData = dragonBonesData.getArmature(armatureName);
                    if (armatureData) {
                        dataPackage.dataName = eachDragonBonesName;
                        dataPackage.data = dragonBonesData;
                        dataPackage.armature = armatureData;
                        dataPackage.skin = armatureData.getSkin(skinName);
                        if (!dataPackage.skin) {
                            dataPackage.skin = armatureData.defaultSkin;
                        }
                        return true;
                    }
                }
            }
        }
        return false;
    }
    
    _buildBones(dataPackage, armature) {
        var bones = dataPackage.armature.sortedBones;
        for (var i = 0, l = bones.length; i < l; ++i) {
            var boneData = bones[i];
            var bone = BaseObject.borrowObject(Bone);
            bone.name = boneData.name;
            bone.inheritTranslation = boneData.inheritTranslation;
            bone.inheritRotation = boneData.inheritRotation;
            bone.inheritScale = boneData.inheritScale;
            bone.length = boneData.length;
            bone.origin.copyFrom(boneData.transform);
            if (boneData.parent) {
                armature.addBone(bone, boneData.parent.name);
            }
            else {
                armature.addBone(bone);
            }
            if (boneData.ik) {
                bone.ikBendPositive = boneData.bendPositive;
                bone.ikWeight = boneData.weight;
                bone._setIK(armature.getBone(boneData.ik.name), boneData.chain, boneData.chainIndex);
            }
        }
    }
    
    _buildSlots(dataPackage, armature) {
        var currentSkin = dataPackage.skin;
        var defaultSkin = dataPackage.armature.defaultSkin;
        var slotDisplayDataSetMap = {};
        for (var i in defaultSkin.slots) {
            var slotDisplayDataSet = defaultSkin.slots[i];
            slotDisplayDataSetMap[slotDisplayDataSet.slot.name] = slotDisplayDataSet;
        }
        if (currentSkin != defaultSkin) {
            for (var i in currentSkin.slots) {
                var slotDisplayDataSet = currentSkin.slots[i];
                slotDisplayDataSetMap[slotDisplayDataSet.slot.name] = slotDisplayDataSet;
            }
        }
        var slots = dataPackage.armature.sortedSlots;
        for (var i = 0, l = slots.length; i < l; ++i) {
            var slotData = slots[i];
            var slotDisplayDataSet = slotDisplayDataSetMap[slotData.name];
            if (!slotDisplayDataSet) {
                continue;
            }
            var slot = this._generateSlot(dataPackage, slotDisplayDataSet);
            if (slot) {
                slot._displayDataSet = slotDisplayDataSet;
                slot._setDisplayIndex(slotData.displayIndex);
                slot._setBlendMode(slotData.blendMode);
                slot._setColor(slotData.color);
                slot._replacedDisplayDataSet.length = slot._displayDataSet.displays.length;
                armature.addSlot(slot, slotData.parent.name);
            }
        }
    }
    
    _replaceSlotDisplay(dataPackage, displayData, slot, displayIndex) {
        if (displayIndex < 0) {
            displayIndex = slot.displayIndex;
        }
        if (displayIndex >= 0) {
            var displayList = slot.displayList; // Copy.
            if (displayList.length <= displayIndex) {
                displayList.length = displayIndex + 1;
            }
            if (slot._replacedDisplayDataSet.length <= displayIndex) {
                slot._replacedDisplayDataSet.length = displayIndex + 1;
            }
            slot._replacedDisplayDataSet[displayIndex] = displayData;
            if (displayData.type == 1 /* Armature */) {
                var childArmature = this.buildArmature(displayData.name, dataPackage.dataName);
                displayList[displayIndex] = childArmature;
            }
            else {
                if (!displayData.texture) {
                    displayData.texture = this._getTextureData(dataPackage.dataName, displayData.name);
                }
                if (displayData.mesh ||
                    (displayIndex < slot._displayDataSet.displays.length && slot._displayDataSet.displays[displayIndex].mesh)) {
                    displayList[displayIndex] = slot.MeshDisplay;
                }
                else {
                    displayList[displayIndex] = slot.rawDisplay;
                }
            }
            slot.displayList = displayList;
            slot.invalidUpdate();
        }
    }

    /**
     * @version DragonBones 4.5
     */
    parseDragonBonesData(rawData, dragonBonesName = null) {
        var dragonBonesData = this._dataParser.parseDragonBonesData(rawData, 1);
        this.addDragonBonesData(dragonBonesData, dragonBonesName);
        return dragonBonesData;
    }
    /**
     * @version DragonBones 4.5
     */
    parseTextureAtlasData(rawData, textureAtlas, name = null, scale = 0) {
        var textureAtlasData = this._generateTextureAtlasData(null, null);
        this._dataParser.parseTextureAtlasData(rawData, textureAtlasData, scale);
        this._generateTextureAtlasData(textureAtlasData, textureAtlas);
        this.addTextureAtlasData(textureAtlasData, name);
        return textureAtlasData;
    }
 
    /**
     * @version DragonBones 3.0
     */
    getDragonBonesData(name) {
        return this._dragonBonesDataMap[name];
    }

    /**
     * @version DragonBones 3.0
     */
    addDragonBonesData(data, dragonBonesName = null) {
        if (data) {
            dragonBonesName = dragonBonesName || data.name;
            if (dragonBonesName) {
                if (!this._dragonBonesDataMap[dragonBonesName]) {
                    this._dragonBonesDataMap[dragonBonesName] = data;
                }
                else {
                    console.warn("Same name data.");
                }
            }
            else {
                console.warn("Unnamed data.");
            }
        }
        else {
            throw new Error();
        }
    }

    /**
	* @version DragonBones 3.0
	*/
    removeDragonBonesData(dragonBonesName, disposeData = true) {
        var dragonBonesData = this._dragonBonesDataMap[dragonBonesName];
        if (dragonBonesData) {
            if (disposeData) {
                if (DragonBones.debug) {
                    for (var i = 0, l = DragonBones._armatures.length; i < l; ++i) {
                        var armature = DragonBones._armatures[i];
                        if (armature.armatureData.parent == dragonBonesData) {
                            throw new Error("ArmatureData: " + armature.armatureData.name + " DragonBonesData: " + dragonBonesName);
                        }
                    }
                }
                dragonBonesData.returnToPool();
            }
            delete this._dragonBonesDataMap[dragonBonesName];
        }
    }

    /**
     * @version DragonBones 3.0
     */
    getTextureAtlasData(dragonBonesName) {
        return this._textureAtlasDataMap[dragonBonesName];
    }

    /**
     * @version DragonBones 3.0
     */
    addTextureAtlasData(data, dragonBonesName = null) {
        if (data) {
            dragonBonesName = dragonBonesName || data.name;
            if (dragonBonesName) {
                var textureAtlasList = this._textureAtlasDataMap[dragonBonesName] = this._textureAtlasDataMap[dragonBonesName] || [];
                if (textureAtlasList.indexOf(data) < 0) {
                    textureAtlasList.push(data);
                }
            }
            else {
                console.warn("Unnamed data.");
            }
        }
        else {
            throw new Error();
        }
    }

    /**
     * @version DragonBones 3.0
     */
    removeTextureAtlasData(dragonBonesName, disposeData = true) {
        var textureAtlasDataList = this._textureAtlasDataMap[dragonBonesName];
        if (textureAtlasDataList) {
            if (disposeData) {
                for (var i = 0, l = textureAtlasDataList.length; i < l; ++i) {
                    textureAtlasDataList[i].returnToPool();
                }
            }
            delete this._textureAtlasDataMap[dragonBonesName];
        }
    }

    /**
     * @version DragonBones 4.5
     */
    clear(disposeData = true) {
        for (var i in this._dragonBonesDataMap) {
            if (disposeData) {
                this._dragonBonesDataMap[i].returnToPool();
            }
            delete this._dragonBonesDataMap[i];
        }
        for (var i in this._textureAtlasDataMap) {
            if (disposeData) {
                var textureAtlasDataList = this._textureAtlasDataMap[i];
                for (var i_4 = 0, l = textureAtlasDataList.length; i_4 < l; ++i_4) {
                    textureAtlasDataList[i_4].returnToPool();
                }
            }
            delete this._textureAtlasDataMap[i];
        }
    }

    /**
     * @version DragonBones 3.0
     */
    buildArmature(armatureName, dragonBonesName = null, skinName = null) {
        var dataPackage = {};
        if (this._fillBuildArmaturePackage(dragonBonesName, armatureName, skinName, dataPackage)) {
            var armature = this._generateArmature(dataPackage);
            this._buildBones(dataPackage, armature);
            this._buildSlots(dataPackage, armature);
            armature.advanceTime(0); // Update armature pose.
            return armature;
        }
        return null;
    }

    /**
     * @version DragonBones 4.5
     */
    copyAnimationsToArmature(toArmature, fromArmatreName, fromSkinName = null, fromDragonBonesDataName = null,
            ifRemoveOriginalAnimationList = true) {
        var dataPackage = {};
        if (this._fillBuildArmaturePackage(fromDragonBonesDataName, fromArmatreName, fromSkinName, dataPackage)) {
            var fromArmatureData = dataPackage.armature;
            if (ifRemoveOriginalAnimationList) {
                toArmature.animation.animations = fromArmatureData.animations;
            }
            else {
                var animations = {};
                for (var animationName in toArmature.animation.animations) {
                    animations[animationName] = toArmature.animation.animations[animationName];
                }
                for (var animationName in fromArmatureData.animations) {
                    animations[animationName] = fromArmatureData.animations[animationName];
                }
                toArmature.animation.animations = animations;
            }
            if (dataPackage.skin) {
                var slots = toArmature.getSlots();
                for (var i = 0, l = slots.length; i < l; ++i) {
                    var toSlot = slots[i];
                    var toSlotDisplayList = toSlot.displayList;
                    for (var i_5 = 0, l_3 = toSlotDisplayList.length; i_5 < l_3; ++i_5) {
                        var toDisplayObject = toSlotDisplayList[i_5];
                        if (toDisplayObject instanceof Armature) {
                            var displays = dataPackage.skin.getSlot(toSlot.name).displays;
                            if (i_5 < displays.length) {
                                var fromDisplayData = displays[i_5];
                                if (fromDisplayData.type == 1 /* Armature */) {
                                    this.copyAnimationsToArmature(toDisplayObject, fromDisplayData.name, fromSkinName, fromDragonBonesDataName, ifRemoveOriginalAnimationList);
                                }
                            }
                        }
                    }
                }
                return true;
            }
        }
        return false;
    }

    /**
     * @version DragonBones 4.5
     */
    replaceSlotDisplay(dragonBonesName, armatureName, slotName, displayName, slot, displayIndex = -1) {
        var dataPackage = {};
        if (this._fillBuildArmaturePackage(dragonBonesName, armatureName, null, dataPackage)) {
            var slotDisplayDataSet = dataPackage.skin.getSlot(slotName);
            if (slotDisplayDataSet) {
                for (var i = 0, l = slotDisplayDataSet.displays.length; i < l; ++i) {
                    var displayData = slotDisplayDataSet.displays[i];
                    if (displayData.name == displayName) {
                        this._replaceSlotDisplay(dataPackage, displayData, slot, displayIndex);
                        break;
                    }
                }
            }
        }
    }

    /**
     * @version DragonBones 4.5
     */
    replaceSlotDisplayList(dragonBonesName, armatureName, slotName, slot) {
        var dataPackage = {};
        if (this._fillBuildArmaturePackage(dragonBonesName, armatureName, null, dataPackage)) {
            var slotDisplayDataSet = dataPackage.skin.getSlot(slotName);
            if (slotDisplayDataSet) {
                var displayIndex = 0;
                for (var i = 0, l = slotDisplayDataSet.displays.length; i < l; ++i) {
                    var displayData = slotDisplayDataSet.displays[i];
                    this._replaceSlotDisplay(dataPackage, displayData, slot, displayIndex++);
                }
            }
        }
    }

    /**
     * @private
     */
    getAllDragonBonesData() {
        return this._dragonBonesDataMap;
    }

    /**
     * @private
     */
    getAllTextureAtlasData() {
        return this._textureAtlasDataMap;
    }

    static get _defaultParser() { return BaseFactory.__defaultParser; }
    static set _defaultParser(value) { BaseFactory.__defaultParser = value; }

}