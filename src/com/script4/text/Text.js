import { Script4 } from '../Script4';

export class Text extends Phaser.Text {

	constructor(_x = 0, _y = 0, _text = '', style) {
		super(Script4.core, _x , _y, _text, style);
	}

}