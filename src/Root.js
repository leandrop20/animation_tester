import { Script4 } from './com/script4/Script4';
import { Sprite } from './com/script4/display/Sprite';
import { ContextMenu } from './com/script4/ui/ContextMenu';	
import { ContextMenuItem } from './com/script4/ui/ContextMenuItem';	
import { SoundMixer } from './com/script4/media/SoundMixer';
import { SimpleButton } from './com/script4/display/SimpleButton';
import { Event } from './com/script4/events/Event';
import { Loader } from './com/script4/display/Loader';
import { ImageSuper } from './com/script4/display/ImageSuper';
import { Spine } from './com/script4/display/Spine';
import { Text } from './com/script4/text/Text';
import { ATLAS } from './com/phaser-spine';

import { Main } from './Main';
import { EventType } from './enums/EventType';
import TweenMax from "TweenMax";

export class Root extends Sprite {

	constructor() {
		super();
		
		ContextMenu.customItems.push(new ContextMenuItem('Versão', '0.0.1'));
		ContextMenu.customItems.push(new ContextMenuItem('Desenvolvido por', 'JaspionJr'));
		
		this.btImage = new SimpleButton('btImage', (Script4.width * 0.5) - 150, Script4.height - 30);
		this.btImage.name = 'png';
		this.addChild(this.btImage);

		this.btJson = new SimpleButton('btJson', Script4.width * 0.5, Script4.height - 30);
		this.btJson.name = 'json';
		this.addChild(this.btJson);

		this.btAtlas = new SimpleButton('btAtlas', (Script4.width * 0.5) + 150, Script4.height - 30);
		this.btAtlas.name = 'atlas';
		this.addChild(this.btAtlas);

		this.loader = new Loader();

		this.createInputFile();
		this.eventSelectFiles(EventType.ADD);

		this.loading = '';
		this.animations = [];
		this.currentId = 0;

		this.files = { png: null, json: null, atlas: null };
	}

	createInputFile() {
		this.inputFile = document.createElement('input');
		this.inputFile.type = 'file';
		this.inputFile.style.position = 'absolute';
		this.inputFile.style.top = '-100px';
		document.body.appendChild(this.inputFile);
	}

	eventSelectFiles(type) {
		this.btImage[type.name + 'EventListener'](Event.TRIGGERED, this.onOpen.bind(this));
		this.btJson[type.name + 'EventListener'](Event.TRIGGERED, this.onOpen.bind(this));
		this.btAtlas[type.name + 'EventListener'](Event.TRIGGERED, this.onOpen.bind(this));
		this.inputFile[type.name + 'EventListener']('change', this.onSelected.bind(this));
	}

	onOpen(e) {
		this.loading = e.target.name;
		this.inputFile.accept = '.' + e.target.name;
		this.inputFile.click();
	}

	onSelected(e) {
		var url = window.URL.createObjectURL(e.target.files[0]);
		this.files[this.loading] = url;

		switch (this.loading) {
			case 'png':
				this.btImage.enabled = false;
				break;
			case 'json':
				this.btJson.enabled = false;
				break;
			case 'atlas':
				this.btAtlas.enabled = false;
				break;
		}

		if (!this.btImage.enabled && !this.btJson.enabled && !this.btAtlas.enabled) {
			this.loadAnimation('animation', this.files.png, this.files.json, this.files.atlas);
		}
	}

	loadAnimation(key, urlImage, urlJson, urlAtlas, scalingVariants) {
		var atlasKey = key + "Atlas";
        var cacheData = {
            atlas: atlasKey,
            basePath: (urlImage.substring(0, urlImage.lastIndexOf('/')) === '') ? '.' : urlImage.substring(0, urlImage.lastIndexOf('/')),
            variants: undefined
        };

        if (undefined === scalingVariants) {
            scalingVariants = [''];
        } else {
            cacheData.variants = scalingVariants;
        }

        scalingVariants.forEach((variant) => {
            this.loader.onFileComplete.add((progress, cacheKey) => {
                if (cacheKey === atlasKey) {
                    var atlas = new ATLAS(this.game.cache.getText(cacheKey), {
                        load: (page, file, atlas) => {
                            this.loader.image(file, urlImage);
                        }
                    });
                }
            });
        });

        this.loader.text(atlasKey, urlAtlas);
        this.loader.json(key, urlJson);
        this.loader.start();
        this.game.cache.addSpine(key, cacheData);

        setTimeout(() => {
        	this.createAnimation();
        }, 1000);
	}

	createAnimation() {
		this.eventSelectFiles(EventType.REMOVE);

		this.animation = new Spine('animation', Script4.width * 0.5, Script4.height * 0.5);
		this.addChild(this.animation);

		for (let a of this.animation.skeletonData.animations) {
			this.animations.push(a.name);
		}

		this.btImage.removeFromParent();
		this.btJson.removeFromParent();
		this.btAtlas.removeFromParent();

		this.createAnimationControls();
	}

	createAnimationControls() {
		this.tf = new Text(0, 0, 'name', {
			fill: '#FFFFFF',
			font: 'bold 20px Arial',
			boundsAlignH: 'center'
		});
		this.tf.setTextBounds(0, Script4.height - 80, 768, 30);
		this.addChild(this.tf);

		this.btPrev = new SimpleButton('btPrev', (Script4.width * 0.5) - 40, Script4.height - 30);
		this.btPrev.name = 'prev';
		this.addChild(this.btPrev);

		this.btPlay = new SimpleButton('btPlay', Script4.width * 0.5, Script4.height - 30);
		this.btPlay.name = 'play';
		this.addChild(this.btPlay);

		this.btNext = new SimpleButton('btNext', (Script4.width * 0.5) + 40, Script4.height - 30);
		this.btNext.name = 'next';
		this.addChild(this.btNext);

		this.eventControls(EventType.ADD);
	}

	eventControls(type) {
		this.btPrev[type.name + 'EventListener'](Event.TRIGGERED, this.onControlClick.bind(this));
		this.btPlay[type.name + 'EventListener'](Event.TRIGGERED, this.onControlClick.bind(this));
		this.btNext[type.name + 'EventListener'](Event.TRIGGERED, this.onControlClick.bind(this));
	}

	onControlClick(e) {
		switch (e.target.name) {
			case 'next': this.currentId++; break;
			case 'prev': this.currentId--; break;
		}

		if (this.currentId > this.animations.length - 1) { this.currentId = 0; }
		if (this.currentId < 0) { this.currentId = this.animations.length - 1; }

		this.animation.play(this.animations[this.currentId], true);
		this.tf.text = this.animations[this.currentId];
	}
	
}