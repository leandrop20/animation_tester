import { Assets } from '../../../../src/Assets';

export class Preloader {

	preload() {
		this.logo = this.add.sprite(
			this.world.width * 0.5, (this.world.height * 0.5) - 15, 'imgLoad');
		this.logo.anchor.set(0.5);

		this.boxBar = this.add.group();
		this.boxBar.position.set(this.world.width * 0.5, (this.world.height * 0.5) + 60);

		this.bar = this.boxBar.create(0, 0, 'imgBar');
		this.bar.anchor.set(0.0, 0.5);
		this.bar.width = 208;
		this.bar.position.set(-(this.bar.width * 0.5) -3, -3);
		this.bar.scale.set((0.0 * this.bar.width) / 8, 1.0);

		this.bgBar = this.boxBar.create(0, 0, 'imgBgBar');
		this.bgBar.anchor.set(0.5);

		this.load.onFileComplete.add(this.fileComplete, this);
		this.load.onLoadComplete.add(this.loadComplete, this);
	}

	create() {
		for (var i = 0; i < Assets.ASSETS.length; i++) {
			switch(Assets.ASSETS[i].type) {
				case 'image':
					this.load.image(Assets.ASSETS[i].name, Assets.ASSETS[i].path);
					break;
				case 'audio':
					this.load.audio(Assets.ASSETS[i].name, Assets.ASSETS[i].path);
					break;
				case 'spine':
					this.load.spine(Assets.ASSETS[i].name, Assets.ASSETS[i].path);
					break;			
				case 'spritesheet':
					this.load.spritesheet(Assets.ASSETS[i].name, Assets.ASSETS[i].path);
					break;
				case 'atlas':
					this.load.atlas(Assets.ASSETS[i].name,
						Assets.ASSETS[i].path.substr(
							0, Assets.ASSETS[i].path.length - 4) + 'png', Assets.ASSETS[i].path);
					this.load.json(Assets.ASSETS[i].name + "Data",
						Assets.ASSETS[i].path.substr(
							0, Assets.ASSETS[i].path.length - 4) + 'json', Assets.ASSETS[i].path);
					break;
				case 'bitmapfont':
					this.load.bitmapFont(Assets.ASSETS[i].name, 
						Assets.ASSETS[i].path.substr(
							0, Assets.ASSETS[i].path.length - 3) + 'png', Assets.ASSETS[i].path);
					 break;
				case 'particle':
					this.load.image(Assets.ASSETS[i].name, Assets.ASSETS[i].path);
					this.load.json(Assets.ASSETS[i].name + 'Settings',
						Assets.ASSETS[i].path.substr(
							0, Assets.ASSETS[i].path.length - 3) + 'json', Assets.ASSETS[i].path);
					break;
				case 'xml':
					this.load.xml(Assets.ASSETS[i].name, Assets.ASSETS[i].path);
					break;
				case 'dragonbones':
					this.load.dragonbones(Assets.ASSETS[i].name, Assets.ASSETS[i].path);
					break;
				case 'tilemap':
					this.load.tilemap(Assets.ASSETS[i].name,
						Assets.ASSETS[i].path, null, Phaser.Tilemap.TILED_JSON);
					this.load.image(Assets.ASSETS[i].name, 
						Assets.ASSETS[i].path.substr(0, Assets.ASSETS[i].path.length - 4) + 'png');
					break;
			}
		}

		this.load.start();
	}

	fileComplete(progress) {
		if (this.bar) {
			this.bar.scale.set(((progress / 100) * 208) / 8, 1.0);
		}
	}

	loadComplete() {
		this.ready = true;
		this.world.removeAll();
		new this.game.rootClass();
	}
	
}