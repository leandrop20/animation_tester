import { Script4 } from '../Script4';

export class ButtonSuper extends Phaser.Button {

	constructor(texture, x = 0, y = 0, callBack = null) {
		super(Script4.core, x, y, texture, callBack);
		this.anchor.set(0.5);
		this.scaleWhenDown = 0.95;
		this.onInputDown.add(this.onDown, this);
		this.onInputUp.add(this.onUp, this);
	}

	onDown() {
		this.scale.set(this.scaleWhenDown);
	}

	onUp() {
		this.scale.set(1.0);
	}

	addEventListener(type, listener) {
		if (!type) throw('event type not found!');
		this[type].add(listener);
	}

	removeEventListener(type, listener) {
		if (!type) throw('event type not found!');
		this[type].remove(listener);
	}

	removeFromParent() { if (this.parent) { this.parent.removeChild(this); } }
	
}