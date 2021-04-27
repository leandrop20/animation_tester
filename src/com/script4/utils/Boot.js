import { Script4 } from '../Script4';
import PhaserSpine from '../../phaser-spine';
import DragonBonesPlugin from '../../dragonbones/Plugin';

import { Assets } from '../../../Assets';

export class Boot {
	
	preload() {
		this.game.plugins.add(PhaserSpine.SpinePlugin);
		this.game.plugins.add(DragonBonesPlugin);
		this.game.load.baseURL = Assets.baseURL;

		if (this.game.config.crossOrigin) {
			this.game.load.crossOrigin = this.game.config.crossOrigin;
		}

		for (var i = 0; i < Script4.imagesToPreLoader.length; i++) {
			this.load.image(Script4.imagesToPreLoader[i].name, Script4.imagesToPreLoader[i].url);
		}
	}

	create() {
		this.state.start(Script4.customPreloader.name);
	}

}