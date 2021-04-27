import { Script4 } from '../Script4';

export class Tween extends Phaser.Tween {
	
	constructor(target, time, properties) {
		super(target, Script4.core, Script4.core.tweens);
		if (target instanceof Phaser.Point) { properties.x = properties.scaleX; delete properties.scaleX; }
		if (target instanceof Phaser.Point) { properties.y = properties.scaleY; delete properties.scaleY; }
		this.to(properties, time * 1000, this.getTransition(properties.transition));
		this.delay(properties.delay * 1000);
		this.repeatCounter = properties.repeatCount;
		this.yoyo(properties.reverse);
			if (properties.onComplete) {
			var args = (properties.onStartArgs)?properties.onStartArgs.toString().split(','):[];
			var args = (properties.onCompleteArgs)?properties.onCompleteArgs.toString().split(','):[];
			this.onStart.add(function() { 
					if (properties.onStart) { properties.onStart(...args); }
				});
			this.onComplete.add(function() { properties.onComplete(...args); });
		}

		if ((properties.scaleX != undefined || properties.scaleY != undefined) && !(target instanceof Phaser.Point)) {
			this.tweenScale = new Tween(target.scale, time, {
				scaleX: properties.scaleX, scaleY: properties.scaleY,
				delay:properties.delay, repeatCount:properties.repeatCount, reverse:properties.reverse, transition:properties.transition
			});
		}
	}

	start() {
		Phaser.Tween.prototype.start.call(this);
		if (this.tweenScale) { this.tweenScale.start(); }
	}

	getTransition(transition) {
		var out = Phaser.Easing.Linear.None;
		switch(transition) {
			// case 'easeIn': out = Phaser.Easing.; break;
			case 'easeInBack': out = Phaser.Easing.Back.In; break;
			case 'easeInBounce': out = Phaser.Easing.Bounce.In; break;
			case 'easeInElastic': out = Phaser.Easing.Elastic.In; break;
			// case 'easeInOut': out = Phaser.Easing.; break;
			case 'easeInOutBack': out = Phaser.Easing.Back.InOut; break;
			case 'easeInOutBounce': out = Phaser.Easing.Bounce.InOut; break;
			case 'easeInOutElastic': out = Phaser.Easing.Elastic.InOut; break;
			// case 'easeOut': out = Phaser.Easing.; break;
			case 'easeOutBack': out = Phaser.Easing.Back.Out; break;
			case 'easeOutBounce': out = Phaser.Easing.Bounce.Out; break;
			case 'easeOutElastic': out = Phaser.Easing.Elastic.Out; break;
			// case 'easeOutIn': out = Phaser.Easing.; break;
			// case 'easeOutInBack': out = Phaser.Easing.; break;
			// case 'easeOutInBounce': out = Phaser.Easing.; break;
			// case 'easeOutInElastic': out = Phaser.Easing.; break;
			case 'linear': out = Phaser.Easing.Linear.None; break;
		}
		return out;
	}

}