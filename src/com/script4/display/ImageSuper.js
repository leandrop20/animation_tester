import { Script4 } from '../Script4';
import { BitmapData } from '../display/BitmapData';
import { Align } from '../utils/Align';
import { Point } from '../geom/Point';

import { ButtonSuper } from './ButtonSuper';
import { Graphics } from './Graphics';
import { TouchEvent } from '../events/TouchEvent';
import { TouchPhase } from '../events/TouchPhase';

export class ImageSuper extends Phaser.Image {

	/**
	* texture = if atlas (atlas.textureName) or textureName only!
	*/
	constructor(texture, x = 0, y = 0) {
		var atlas = texture;
		if (!(texture instanceof BitmapData) && !(texture instanceof PIXI.Texture)) {
			if (texture.indexOf('.') != -1) {
				var parts = texture.split('.');
				atlas = parts[0];
				texture = parts[1] + '.png';
			} else {
				texture = null;
			}
		}
		
		super(Script4.core, x, y, atlas, texture);

		this.touchEventCallBack;
		this.inputEnabled = true;
	}

	//@override
	loadTexture(key, frame, stopAnimation) {
		super.loadTexture(key, frame, stopAnimation);

		if (key instanceof PIXI.Texture) {
			this.setSize(key.baseTexture.width, key.baseTexture.height);
		}

		this.atlasPosition = (this.atlasPosition) ? this.atlasPosition : new Point();

		if (frame && !(key instanceof PIXI.Texture)) {
			var data = Script4.core.cache.getJSON(key + "Data");
			if (data) {
				var spriteSourceSize = data.frames[frame].spriteSourceSize;
				if (spriteSourceSize && (spriteSourceSize.x != 0 || spriteSourceSize.y != 0)) {
					this.atlasPosition.x = spriteSourceSize.x;
					this.atlasPosition.y = spriteSourceSize.y;
					this.x = 0;
					this.y = 0;
				}
			}
		}
	}

	setSize(w, h) {
		this.width = w;
		this.height = h;
	}

	readjustSize() {
		this.width = this.texture.frame.width;
		this.height = this.texture.frame.height;
	}

	get x() { return this.position.x; }

	//@override
	set x(value) {
		this.position.x = this.atlasPosition.x + value;
	}

	get y() { return this.position.y; }

	//@override
	set y(value) {
		this.position.y = this.atlasPosition.y + value;
	}

	get color() { return this.tint; }

	set color(value) {
		this.tint = value;
	}

	align(hAlign = Align.CENTER, vAlign = Align.MIDDLE) {
		this.hAlign = hAlign;
		this.vAlign = vAlign;
	}

	set hAlign(value) {
		switch (value) {
			case Align.LEFT: this.anchor.x = 0.0; break;
			case Align.CENTER: this.anchor.x = 0.5; break;
			case Align.RIGHT: this.anchor.x = 1.0; break;
		}
	}

	set vAlign(value) {
		switch (value) {
			case Align.TOP: this.anchor.y = 0.0; break;
			case Align.MIDDLE: this.anchor.y = 0.5; break;
			case Align.BOTTOM: this.anchor.y = 1.0; break;
		}
	}

	get scaleX() { return this.scale.x; }
	
	set scaleX(value) { this.scale.x = value; }
	
	get scaleY() { return this.scale.y; }

	set scaleY(value) { this.scale.y = value; }

	removeFromParent() { if (this.parent) { this.parent.removeChild(this); } }

	touchEvent(object, pointer, isDown) {
		var target;
		var currentTarget;
		if (!(object instanceof ButtonSuper)) {
			object = ((object instanceof Phaser.Graphics || object instanceof Graphics))?object.parent:object;
			currentTarget = object;
			target = getTarget(object);

			if (isDown == undefined) {
				target.isTouchDown = true;
				target.game.input.addMoveCallback(target.onMove, target);
				target.touchEventCallBack(new TouchEvent(TouchPhase.BEGAN, target, currentTarget));
			} else {
				target.isTouchDown = false;
				target.game.input.deleteMoveCallback(target.onMove, target);
				target.touchEventCallBack(new TouchEvent(TouchPhase.ENDED, target, currentTarget));
			}
		}

		function getTarget(_obj) {
			if (!_obj.touchEventCallBack) {
				return getTarget(_obj.parent);
			}
			return _obj;
		}
	}

	onMove() {
		this.touchEventCallBack(new TouchEvent(TouchPhase.MOVED, this));
	}

	addEventListener(type, listener) {
		if (!type) throw('event type not found!');
		if (type == 'touch') {
			this.touchEventCallBack = listener;
			
			this.events['onInputDown'].add(this.touchEvent);
			this.events['onInputUp'].add(this.touchEvent);
		} else if (type == 'enterFrame') {
			this.enterFrameEvent = this.game.time.events.loop(33, listener, this);
		}
	}

	removeEventListener(type, listener) {
		if (!type) throw('event type not found!');
		if (type == 'touch') {
			this.events['onInputDown'].remove(this.touchEvent);
			this.events['onInputUp'].remove(this.touchEvent);
		} else if (type == 'enterFrame') {
			if (this.enterFrameEvent) { this.game.time.events.remove(this.enterFrameEvent); this.enterFrameEvent = null; }
		}
	}
	
}