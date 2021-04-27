import { BaseFactory } from './BaseFactory';
import { PhaserArmatureDisplay } from './PhaserArmatureDisplay';
import { WorldClock } from './WorldClock';
import { BaseObject } from './BaseObject';
import { PhaserTextureAtlasData } from './PhaserTextureAtlasData';
import { Armature } from './Armature';
import { Animation } from './Animation';
import { PhaserSlot } from './PhaserSlot';
import { DragonBones } from './DragonBones';

export class PhaserFactory extends BaseFactory {

	constructor(dataParser = null) {
		super(dataParser);

		if (!PhaserFactory._eventManager) {
			PhaserFactory._eventManager = new PhaserArmatureDisplay();
			PhaserFactory._clock = new WorldClock();
		}
	}

	static _clockHandler(passedTime) {
        PhaserFactory._clock.advanceTime(-1); // passedTime !?
    }

    get factory() {
    	if (!PhaserFactory._factory) {
            PhaserFactory._factory = new PhaserFactory();
        }
        return PhaserFactory._factory;
    }

    _generateTextureAtlasData(textureAtlasData, textureAtlas) {
        if (textureAtlasData) {
            textureAtlasData.texture = textureAtlas;
        }
        else {
            textureAtlasData = BaseObject.borrowObject(PhaserTextureAtlasData);
        }
        return textureAtlasData;
    }
    
    _generateArmature(dataPackage) {
        var armature = BaseObject.borrowObject(Armature);
        var armatureDisplayContainer = new PhaserArmatureDisplay();
        armature._armatureData = dataPackage.armature;
        armature._skinData = dataPackage.skin;
        armature._animation = BaseObject.borrowObject(Animation);
        armature._display = armatureDisplayContainer;
        armature._eventManager = PhaserFactory._eventManager;
        armatureDisplayContainer._armature = armature;
        armature._animation._armature = armature;
        armature.animation.animations = dataPackage.armature.animations;
        return armature;
    }
    
    _generateSlot(dataPackage, slotDisplayDataSet) {
        var slot = BaseObject.borrowObject(PhaserSlot);
        var slotData = slotDisplayDataSet.slot;
        var displayList = [];
        slot.name = slotData.name;
        slot._rawDisplay = new Phaser.Sprite(DragonBones.GAME, 0, 0);
        slot._meshDisplay = null;
        for (var i = 0, l = slotDisplayDataSet.displays.length; i < l; ++i) {
            var displayData = slotDisplayDataSet.displays[i];
            switch (displayData.type) {
                case 0 /* Image */:
                    if (!displayData.texture) {
                        displayData.texture = this._getTextureData(dataPackage.dataName, displayData.name);
                    }
                    displayList.push(slot._rawDisplay);
                    break;
                case 2 /* Mesh */:
                    if (!displayData.texture) {
                        displayData.texture = this._getTextureData(dataPackage.dataName, displayData.name);
                    }
                    displayList.push(slot._meshDisplay);
                    break;
                case 1 /* Armature */:
                    var childArmature = this.buildArmature(displayData.name, dataPackage.dataName);
                    if (childArmature) {
                        if (!slot.inheritAnimation) {
                            var actions = slotData.actions.length > 0 ? slotData.actions : childArmature.armatureData.actions;
                            if (actions.length > 0) {
                                for (var i_1 = 0, l_1 = actions.length; i_1 < l_1; ++i_1) {
                                    childArmature._bufferAction(actions[i_1]);
                                }
                            }
                            else {
                                childArmature.animation.play();
                            }
                        }
                        displayData.armature = childArmature.armatureData; // 
                    }
                    displayList.push(childArmature);
                    break;
                default:
                    displayList.push(null);
                    break;
            }
        }
        slot._setDisplayList(displayList);
        return slot;
    }

    buildArmatureDisplay(armatureName, dragonBonesName = null, skinName = null) {
        var armature = this.buildArmature(armatureName, dragonBonesName, skinName);
        var armatureDisplay = armature ? armature._display : null;
        if (armatureDisplay) {
            armatureDisplay.advanceTimeBySelf(true);
        }
        return armatureDisplay;
    }

    getTextureDisplay(textureName, dragonBonesName = null) {
        var textureData = this._getTextureData(dragonBonesName, textureName);

        if (textureData) {
            if (!textureData.texture) {
                var textureAtlasTexture = textureData.parent.texture;
                var originSize = new Phaser.Rectangle(0, 0, textureData.region.width, textureData.region.height);
                textureData.texture = new PIXI.Texture(textureAtlasTexture, textureData.region, originSize);
            }
            return new Phaser.Sprite(DragonBones.GAME, 0, 0, textureData.texture);
        }
        return null;
    }

    get soundEventManater() {
    	return PhaserFactory._eventManager;
    }

    static get _factory() { return (PhaserFactory.__factory) ? PhaserFactory.__factory : null; }
    static set _factory(value) { PhaserFactory.__factory = value; }
 
    static get _eventManager() { return (PhaserFactory.__eventManager) ? PhaserFactory.__eventManager : null; }
    static set _eventManager(value) { PhaserFactory.__eventManager = value; }

 	static get _clock() { return (PhaserFactory.__clock) ? PhaserFactory.__clock : null; }
 	static set _clock(value) { PhaserFactory.__clock = value; }

}