import { Script4 } from "../Script4";
import { Align } from '../utils/Align';

export class TileSprite extends Phaser.TileSprite {

	/**
	* texture = if atlas (atlas.textureName) or textureName only!
	*/
	constructor(texture, x = 0, y = 0, width = 10, height = 10) {
		var atlas = texture;
		if (texture.indexOf('.') != -1) {
			var parts = texture.split('.');
			atlas = parts[0];
			texture = parts[1] + '.png';
		} else {
			texture = null;
		}
		super(Script4.core, x, y, width, height, atlas, texture);
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

	removeFromParent() { if (this.parent) { this.parent.removeChild(this); } }
	
}