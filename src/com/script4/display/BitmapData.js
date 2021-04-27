import { Script4 } from '../Script4';

export class BitmapData extends Phaser.BitmapData {

	constructor(_width = 256, _height = 256) {
		super(Script4.core, null, _width, _height);
	}

}