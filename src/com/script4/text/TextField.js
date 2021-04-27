import { Script4 } from '../Script4';
import { Align } from "../utils/Align";

export class TextField extends Phaser.Group {

	constructor(width, height, font, text = '', size = null) {
		super(Script4.core);
		this.inputEnableChildren = true;

		this.w = width;
		this.h = height;

		this.box = new Phaser.Graphics(Script4.core, 0, 0);
		this.box.visible = false;
		this.box.lineStyle(1, 0x000000);
		this.box.drawRect(0, 0, width, height);
		this.box.endFill();
		this.addChild(this.box, 0);

		this.field = new Phaser.BitmapText(Script4.core, 0, 0, font, text);
		this.field.align = Align.CENTER;
		this.field.maxWidth = width;
		this.field.fontSize = (size)?size:this.field._data.font.size;
		this.addChild(this.field);

		this._mask = new Phaser.Graphics(Script4.core, 0, 0);
		this._mask.beginFill(0x009900);
		this._mask.drawRect(0, 0, width + 2, height);
		this._mask.endFill();
		this.addChild(this._mask);

		this.field.mask = this._mask;

		this.hit = new Phaser.Graphics(Script4.core, 0, 0);
		this.hit.inputEnabled = true;
		this.hit.beginFill(0x009900, 0.0);
		this.hit.drawRect(0, 0, width, height);
		this.hit.endFill();
		this.addChild(this.hit);

		this.align();
	}

	get color() { return this.field.tint; }

	set color(value) {
		this.field.tint = value;
	}

	set alignText(value) {
		this.field.align = value;
	}

	get width () { return this.w; }

	set width(value) {
		this.w = value;
		this.box.width = value;
		this._mask.width = value;
		this.field.maxWidth = value;
		this.hit.width = value;
	}

	get height () { return this.h; }

	set height(value) {
		this.h = value;
		this.box.height = value;
		this._mask.height = value;
		this.hit.height = value;
	}

	set inputEnabled(bool) {
		this.hit.inputEnabled = bool;
	}

	/**
	*	value = String text
	*/
	appendText(value) {
		this.field.setText(this.field.text + value);
	}

	get text() { return this.field.text; }

	set text(value) { this.field.setText(value); }

	set textColor(value) { this.field.tint = value; }

	set border(bool) { this.box.visible = bool; }

	set borderColor(color) { this.box.lineStyle(1, color); }

	/**
	*	value = Align.LEFT (LEFT, CENTER, RIGHT)
	*/
	set alignPivotX(value) {
		if (value == 'center') {
			this.pivot.x = this.width * 0.5;
		} else if (value == 'right') {
			this.pivot.x = this.width;
		} else {
			this.pivot.x = 0.0;
		}
	}

	/**
	*	value = Align.TOP (TOP, MIDDLE, BOTTOM)
	*/
	set alignPivotY(value) {
		if (value == 'middle') {
			this.pivot.y = this.height * 0.5;
		} else if (value == 'bottom') {
			this.pivot.y = this.height;
		} else {
			this.pivot.y = 0.0;
		}
	}

	alignPivot(hAlign = Align.CENTER, vAlign = Align.MIDDLE) {
		this.alignPivotX = hAlign;
		this.alignPivotY = vAlign;
	}

	/**
	*	value = Align.LEFT (LEFT, CENTER, RIGHT)
	*/
	set hAlign(value) {
		if (value == 'left') {
			this.field.anchor.x = 0.0;
			this.field.x = 0;
		} else if (value == 'center') {
			this.field.anchor.x = 0.5;
			this.field.x = this.w*0.5;
		} else if (value == 'right') {
			this.field.anchor.x = 1.0;
			this.field.x = this.width;
		}
	}

	/**
	*	value = Align.TOP (TOP, MIDDLE, BOTTOM)
	*/
	set vAlign(value) {
		if (value == 'top') {
			this.field.anchor.y = 0.0;
			this.field.y = 0;
		} else  if (value == 'middle') {
			this.field.anchor.y = 0.5;
			this.field.y = this.h*0.5;
		} else if (value == 'bottom') {
			this.field.anchor.y = 1.0;
			this.field.y = this.height;
		}
	}

	align(hAlign = Align.CENTER, vAlign = Align.MIDDLE) {
		this.hAlign = hAlign;
		this.vAlign = vAlign;
	}

	destroyAll() {
		this.removeChildren();
		this.parent.removeChild(this);
	}

}