import { Sprite } from '../display/Sprite';
import { ImageSuper } from '../display/ImageSuper';
import { Event } from '../events/Event';

export class Joystick extends Sprite {
	
	constructor(_bg, _pad, _x = 0, _y = 0) {
		super();

		this.bg = new ImageSuper(_bg);
		this.bg.align();
		this.bg.position.set(_x, _y);
		this.addChild(this.bg);

		this.pad = new ImageSuper(_pad);
		this.pad.align();
		this.pad.position.set(_x, _y);
		this.addChild(this.pad);

		this.touched = false;

		this.isUp = false;
		this.isDown = false;
		this.isLeft = false;
		this.isRight = false;

		this.distance = 0;
		this._angle = 0;
		this._rotation = 0;

		this.velocityX = 0;
		this.velocityY = 0;

		this.point = new Phaser.Point(_x, _y);
		this.pointer = null;
	}

	get radius() {
		return this.scale.x * (this.bg.width / 2);
	}

	onUpdate(e) {
		var joystick = true;

		this.game.input.pointers.forEach(function(p) {
            joystick = this.checkDistance(p);
        }, this);

		joystick = this.checkDistance(this.game.input.mousePointer);

		if (joystick) {
			if ((this.pointer === null) || (this.pointer.isUp)) {
				this.move(this.point);
				this.touched = false;
				this.pointer = null;
			}
		}
	}

	checkDistance(_pointer) {
		var allow = true;

		var d = this.point.distance(_pointer.position);

		if ((_pointer.isDown) && ((_pointer === this.pointer) || 
				(d < this.radius))) {
			allow = false;
			this.touched = true;
			this.pointer = _pointer;
			this.move(_pointer.position);
		}

		return allow;
	}

	move(point) {
		// Calculate x/y of pointer from joystick center
        var deltaX = point.x - this.point.x;
		var deltaY = point.y - this.point.y;

		// Get the angle (radians) of the pointer on the joystick
        var rotation = this.point.angle(point);

        // Set bounds on joystick pad
        if (this.point.distance(point) > this.radius) {
            deltaX = (deltaX === 0) ? 
                0 : Math.cos(rotation) * this.radius;
            deltaY = (deltaY === 0) ?
                0 : Math.sin(rotation) * this.radius;
        }

         // Normalize x/y
        this.velocityX = parseInt((deltaX / this.radius) * 100, 10);
		this.velocityY = parseInt((deltaY / this.radius) * 100, 10);

		// Set polar coordinates
        this._rotation = rotation;
        this._angle = (180 / Math.PI) * rotation;
        this.distance = parseInt((this.point.distance(point) / this.radius) * 100, 10);

        // Set d-pad directions
        this.isUp = ((rotation > Joystick.UP_LOWER_BOUND) && 
            (rotation <= Joystick.UP_UPPER_BOUND));
        this.isDown = ((rotation > Joystick.DOWN_LOWER_BOUND) && 
            (rotation <= Joystick.DOWN_UPPER_BOUND));
        this.isRight = ((rotation > Joystick.RIGHT_LOWER_BOUND) && 
            (rotation <= Joystick.RIGHT_UPPER_BOUND));
        this.isLeft = ((rotation > Joystick.LEFT_LOWER_BOUND) || 
            (rotation <= Joystick.LEFT_UPPER_BOUND));

        // Fix situation where left/right is true if X/Y is centered
        if ((this.velocityX === 0) && (this.velocityY === 0)) {
            this.isRight = false;
            this.isLeft = false;
        }

         // Move joystick pad images
        this.pad.cameraOffset.x = this.point.x + deltaX;
        this.pad.cameraOffset.y = this.point.y + deltaY;
	}

	activate() {
		this.addEventListener(Event.ENTER_FRAME, this.onUpdate);
		this.pad.fixedToCamera = true;
	}

	deactivate() {
		this.removeEventListener(Event.ENTER_FRAME, this.onUpdate);
		this.pad.fixedToCamera = false;
	}

	destroy() {
		this.deactivate();
		this.removeChildren();
		this.removeFromParent();
	}

}

Joystick.UP_LOWER_BOUND = -7 * (Math.PI / 8);
Joystick.UP_UPPER_BOUND = -1 * (Math.PI / 8);
Joystick.DOWN_LOWER_BOUND = Math.PI / 8;
Joystick.DOWN_UPPER_BOUND = 7 * (Math.PI / 8);
Joystick.RIGHT_LOWER_BOUND = -3 * (Math.PI / 8);
Joystick.RIGHT_UPPER_BOUND = 3 * (Math.PI / 8);
Joystick.LEFT_LOWER_BOUND = 5 * (Math.PI / 8);
Joystick.LEFT_UPPER_BOUND = -5 * (Math.PI / 8);