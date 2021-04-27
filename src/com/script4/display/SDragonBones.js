import { Script4 } from '../Script4';
import { DragonBones } from '../../dragonbones/DragonBones';
import { Event } from '../../script4/events/Event';
import { PhaserFactory } from '../../dragonbones/PhaserFactory';

export class SDragonBones extends DragonBones {

	/**
	*
	* @param armatureName String
	* @param x Number
	* @param y Number
	* @param _args Array [{ anime:, func: }]
	*/
	constructor(armatureName, x = 0, y = 0, _args = []) {
		super(Script4.core, armatureName);
		this.args = _args;
		this.ID = armatureName;

		this.position.set(x, y);

		this.addEventListener(Event.ENTER_FRAME, this.onUpdate);

		// console.log("Animations " + armatureName + ": " + this.armature.animation.animationNames);
	}

	animationNames() {
		return this.armature.animation.animationNames;
	}

	play(animationName, playTimes = -1) {
		this.armature.animation.play(animationName, playTimes);
	}

	set debug(value) {
		this.armature.debugDraw = value;
	}

	getBone(name) {
		return this.armature._armature.getBone(name);
	}

	getSlot (name) {
		return this.armature._armature.getSlot(name);
	}

	factoryImage(_name, dragonName = null) {
		dragonName = (dragonName) ? dragonName : this.ID;
		return this.factory.getTextureDisplay(_name, dragonName);
	}

	onUpdate(e) {
		if (this.armature.animation.isCompleted) {
			if (this.args != null) {
				for (var i = 0; i < this.args.length; i++) {
					if (this.armature.animation.lastAnimationState.name == this.args[i].anime) {
						this.args[i]._function();
						break;
					}
				}
			}
		}
	}

	removeEvent() {
		this.removeEventListener(Event.ENTER_FRAME, this.onUpdate);
		this.armature.dispose();
		this.factory.removeTextureAtlasData(this.ID, true);
		this.factory.removeDragonBonesData(this.ID, true);
		this.removeFromParent();
	}

}