import { Script4 } from "../Script4";

export class DelayedCall extends Phaser.Tween {

	constructor(callback, delay, args) {
		super(new Phaser.Point(), Script4.core, Script4.core.tweens);
		this.to({}, delay * 1000);
		this.init(callback, args);
	}

	init(callback, args) {
		this.onRepeat.add(function() { callback(args); });
		this.onComplete.add(function() { callback(args); });
	}

	set repeatCount(value) { this.repeatCounter = value; }
	
}