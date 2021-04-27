import { Script4 } from '../Script4';
import { Graphics } from '../display/Graphics';
import { Sprite } from '../display/Sprite';
import { Text } from '../text/Text';

export class ContextMenu extends Sprite {

	constructor(_x, _y) {
		super();

		var bg = new Graphics();
		bg.lineStyle(1, 0xBDC3C7, 1.0)
		bg.beginFill(0xFFFFFF);
		bg.drawRect(0, 0, 240, 128);
		bg.endFill();
		this.addChild(bg);
		
		this.create();

		bg.height = 30 * ContextMenu.customItems.length;

		if ((_x + this.width) > Script4.width) {
			_x = _x - this.width;
		}
		if ((_y + this.height) > Script4.height) {
			_y = _y - this.height;
		}

		this.position.set(_x, _y);
	}

	create() {
		var tf; var tfSub;
		for (var i = 0; i < ContextMenu.customItems.length; i++) {
			tf = new Text(0, 30, ContextMenu.customItems[i].text, { 
				font: "12px Arial", fill: "#2C3E50" });
			tf.position.set(15, (30 * i) + 8);
			this.addChild(tf);

			tfSub = new Text(0, 30, ContextMenu.customItems[i].subtext, { 
				font: "12px Arial", fill: "#BDC3C7" });
			tfSub.position.set((this.width - tfSub.width) - 15, (30 * i) + 8);
			this.addChild(tfSub);
		}
	}

	destroy() {
		this.removeChildren();
		this.removeFromParent();
	}

}