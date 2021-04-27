import PIXI from 'pixi';
import p2 from 'p2';
import Phaser from 'phaser';

import { Script4 } from './com/script4/Script4';
import { ScaleMode } from './com/script4/utils/ScaleMode';
import { Point } from './com/script4/geom/Point';
import { Root } from './Root';

export class Main {

	constructor(data) {
		let configs = {
			disableVisibilityChange: true,
			enableDebug: false,
			backgroundColor: '#22AAE4',
			scaleMode: ScaleMode.SHOW_ALL,
			fullScreenScaleMode: ScaleMode.SHOW_ALL,
			crossOrigin: 'anonymous',
		}

		/*Script4.customPreloader = {
			name: 'PreLoaderCustom',
			class: new PreLoaderCustom,
		};*/

		Script4.imagesToPreLoader = [
			{ name: 'imgBar', url: 'assets/images/imgBar.png' },
			{ name: 'imgBgBar', url: 'assets/images/imgBgBar.png' },
			{ name: 'imgLoad', url: 'assets/images/imgLoad.png' },
		];

		this.script4 = new Script4(Root, 768 , 450, Phaser.CANVAS, 'stage', configs);
		Main.this = this.script4;

		this.script4.setShowStats = true;
		this.script4.start();
	}

}