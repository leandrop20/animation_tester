import { Sprite } from './Sprite';
import { ImageSuper } from './ImageSuper';
import { TextField } from '../text/TextField';
import { Align } from '../utils/Align';

export class SimpleButton extends Sprite {

	constructor(texture, _x = 0, _y = 0, _font = null, _text = null) {
		super();
		this._enabled = true;
		this._listener;

		this.texture = new ImageSuper(texture);
		this.texture.align(Align.CENTER, Align.MIDDLE);
		this.texture.input.useHandCursor = true;
		this.addChild(this.texture);
		this.texture.events.onInputDown.add(this.onDown, this);
		this.texture.events.onInputUp.add(this.onUp, this);

		if (_font) { this.createTf(_font, _text); }

		this.scaleWhenDown = 0.95;

		this.position.set(_x, _y);
	}

	set upState(texture) {
		var atlas = texture;
		if (!(texture instanceof PIXI.Texture)) {
			if (texture.indexOf('.') != -1) {
				var parts = texture.split('.');
				atlas = parts[0];
				texture = parts[1] + '.png';
			} else {
				texture = null;
			}
		}
		this.texture.loadTexture(atlas, texture);
		this.texture.readjustSize();
	}

	set textureColor(value) { this.texture.tint = value; }

	get enabled() { return this._enabled; }

	set enabled(bool) {
		this._enabled = bool;
		this.texture.inputEnabled = bool;
		if (bool) {
			this.alpha = 1.0;
		} else {
			this.alpha = 0.5;
		}
	}

	createTf(_font, _text) {
		this.tf = new TextField(this.texture.width, this.texture.height, _font, _text);
		this.tf.inputEnabled = false;
		this.tf.position.set(-this.texture.width * 0.5, -this.texture.height * 0.5);
		this.addChild(this.tf);
	}

	set fontName(_fontName) {
		if (this.tf) {
			this.tf.font = _fontName;
		} else {
			this.createTf(_fontName);
		}
	}

	set fontColor(_value) {
		this.tf.textColor = _value;
	}

	get text() { return (this.tf)?this.tf.text:""; }

	set text(value) {
		if (this.tf) { this.tf.text = value; }
	}

	set textBound(rect) {
		if (this.tf) {
			this.tf.position.set((-this.texture.width * 0.5) + rect.x, (-this.texture.height * 0.5) + rect.y);
			if (rect.width != 0) { this.tf.width = rect.width; }
			if (rect.height != 0) { this.tf.height = rect.height; }
		}
	}

	alignText(hAlign = Align.CENTER, vAlign = Align.MIDDLE) {
		if (this.tf) { this.tf.align(hAlign, vAlign); }
	}

	onDown() {
		if (this.enabled) { this.scale.set(this.scaleWhenDown); }
	}

	onUp() {
		if (this.enabled) { this.scale.set(1.0); }
	}

	onEvent() {
		this._listener({ target: this });
	}

	addEventListener(type, listener) {
		if (!type) throw('event type not found!');
		this._listener = listener;
		this.texture.events[type].add(this.onEvent, this);
	}

	removeEventListener(type, listener) {
		if (!type) throw('event type not found!');
		this._listener = null;
		this.texture.events[type].remove(this.onEvent, this);
	}

	destroyAll() {
		this.removeChildren();
		this.removeFromParent();
	}

}