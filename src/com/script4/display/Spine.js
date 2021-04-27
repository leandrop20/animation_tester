import { Script4 } from '../Script4';
import PhaserSpine from '../../phaser-spine';
import { Graphics } from './Graphics';
import { ButtonSuper } from './ButtonSuper';
import { TextField } from '../text/TextField';
import { TouchEvent } from '../events/TouchEvent';
import { TouchPhase } from '../events/TouchPhase';

export class Spine extends PhaserSpine.Spine {

	/**
	*
	* @param armatureName String
	* @param x Number
	* @param y Number
	* @param _args Array [{ anime:, func: }]
	*/
	constructor(armatureName, x = 0, y = 0, _args = []) {
		super(Script4.core, armatureName);
		this.name = null;
		this.args = _args;
		this.parent.removeChild(this);
		this.position.set(x, y);
		this.inputEnableChildren = true;
		this.lastAnimation;
		this.touchEventCallBack;
		this.enterFrameEvent;

		var bounds = this.getBounds();
		this.box = new Graphics();
		this.box.inputEnabled = true;
		this.box.beginFill(0x428B36, 0.0);
		if (bounds.centerX == 1) { bounds.x = bounds.x*2; }
		if (bounds.centerY == 1) { bounds.y = bounds.y*2; }
		this.box.drawRect(bounds.x,bounds.y,bounds.width,bounds.height);
		this.box.endFill();
		this.addChild(this.box);

		var _this = this;
		this.state.onComplete = function() { _this.onComplete(); }
	}

	set name(value) {
		if (this.box) { this.box.name = value; }
		super.name = value;
	}

	set animationSpeed(value = 1.0) {
		this.state.timeScale = value;
	}

	play(animationName, isLoop = false, animationSpeed = 1.0) {
		this.animationSpeed = animationSpeed;
		this.setAnimationByName(0, animationName, isLoop);
		this.lastAnimation = animationName;
	}

	onComplete() {
		for (var i=0; i<this.args.length; i++) {
			if (this.lastAnimation == this.args[i].anime) {
				this.args[i].func({ target:this, animationName:this.lastAnimation });
			}
		}
	}

	getBone(name) {
		for (var i = 0; i < this.skeleton.bones.length; i++) {
			if (this.skeleton.bones[i].data.name == name) {
				return this.skeleton.bones[i];
			}
		}
		return null;
	}

	getSlot(name) {
		for (var i = 0; i < this.skeleton.slots.length; i++) {
			if (this.skeleton.slots[i].currentSpriteName == name) {
				return this.skeleton.slots[i];
			}
		}
		return null;
	}

	get numChildren() { return this.children.length; }

	touchEvent(object, pointer, isDown) {
		if (!(object instanceof ButtonSuper)) {
			object = (object instanceof Phaser.Graphics || object instanceof Graphics)?object.parent:object;	
			if (isDown == undefined) {
				object.isTouchDown = true;
				object.game.input.addMoveCallback(object.onMove, object);
				object.touchEventCallBack(new TouchEvent(TouchPhase.BEGAN, object.parent));
			} else {
				object.isTouchDown = false;
				object.game.input.deleteMoveCallback(object.onMove, object);
				object.touchEventCallBack(new TouchEvent(TouchPhase.ENDED, object.parent));
			}
		}
	}

	onMove() {
		this.touchEventCallBack(new TouchEvent(TouchPhase.MOVED, this.parent));
	}

	addEventListener(type, listener) {
		if (!type) throw('event type not found!');
		if (type == 'touch') {
			this.touchEventCallBack = listener;
			this['onChildInputDown'].add(this.touchEvent);
			this['onChildInputUp'].add(this.touchEvent);
			for (var i=0;i<this.numChildren;i++) {
				if (this.getChildAt(i) instanceof TextField || this.getChildAt(i) instanceof Spine) {
					this.getChildAt(i)['onChildInputDown'].add(this.touchEvent);
					this.getChildAt(i)['onChildInputUp'].add(this.touchEvent);
				}
			}
		} else if (type == 'enterFrame') {
			this.enterFrameEvent = this.game.time.events.loop(33, listener, this);
		}
	}

	removeEventListener(type, listener) {
		if (!type) throw('event type not found!');
		if (type == 'touch') {
			this['onChildInputDown'].remove(this.touchEvent);
			this['onChildInputUp'].remove(this.touchEvent);
			for (var i=0;i<this.numChildren;i++) {
				if (this.getChildAt(i) instanceof TextField || this.getChildAt(i) instanceof Spine) {
					this.getChildAt(i)['onChildInputDown'].remove(this.touchEvent);
					this.getChildAt(i)['onChildInputUp'].remove(this.touchEvent);
				}
			}
		} else if (type == 'enterFrame') {
			if (this.enterFrameEvent) { 
				this.game.time.events.remove(this.enterFrameEvent); this.enterFrameEvent = null;
			}
		}
	}

	removeFromParent() { 
		for (var i = this.numChildren - 1; i > -1; i--) {
			this.removeChild(getChildAt(i));
		}
		this.killAll();
		if (this.parent) { this.parent.removeChild(this); }
	}

}