import { Script4 } from '../Script4';
import { Align } from '../utils/Align';

export class Graphics extends Phaser.Graphics {
	
	constructor(x = 0, y = 0) {
		super(Script4.core, x, y);
	}

	align(hAlign = Align.CENTER, vAlign = Align.MIDDLE) {
		this.hAlign = hAlign;
		this.vAlign = vAlign;
	}

	set hAlign(value) {
		switch (value) {
			case Align.LEFT: this.x = this.x; break;
			case Align.CENTER: this.x = this.x - (this.width * 0.5); break;
			case Align.RIGHT: this.x = this.x - this.width; break;
		}
	}

	set vAlign(value) {
		switch (value) {
			case Align.TOP: this.y = this.y; break;
			case Align.MIDDLE: this.y = this.y - (this.height * 0.5); break;
			case Align.BOTTOM: this.y = this.y - this.height; break;
		}
	}

	removeFromParent() { if (this.parent) { this.parent.removeChild(this); } }

}