import Script4 from "../Script4";
import Align from '../utils/Align';

export class TileMap extends Phaser.Tilemap {

	constructor(texture, tileW = 0, tileH = 0, width = 0, height = 0) {
		super(Script4.core, texture, tileW, tileH, width, height);
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