import { Juggler } from './animation/Juggler';
import { Boot } from './utils/Boot';
import { Preloader } from './utils/Preloader';
import { ContextMenu } from './ui/ContextMenu';
import { ContextMenuItem } from './ui/ContextMenuItem';

export class Script4 extends Phaser.Game {
	
	/**
	* root class
	* width int
	* height int
	* renderer (Phaser.AUTO, Phaser.CANVAS, Phaser.WEBGL)
	* canvasID string
	*/
	constructor(rootClass, width = 768, height = 450, renderer = Phaser.AUTO, 
			canvasID = '', configs = null) {
		super(width, height, renderer, canvasID);

		this.rootClass = rootClass;
		this.state.render = this.render;
		this.showStats = false;
		this._juggler;
		this.contextMenu;

		const IMAGES = [
			{ name: 'imgBar', url: 'assets/images/imgBar.png' },
			{ name: 'imgBgBar', url: 'assets/images/imgBgBar.png' },
			{ name: 'imgLoad', url: 'assets/images/imgLoad.png' }
		];
		
		const PRELOADER = {
			name: 'Preloader',
			class: new Preloader
		};

		const CONFIGS = {
			disableVisibilityChange: true,
			enableDebug: false,
			backgroundColor: '#22AAE4',
			// scaleMode: Phaser.ScaleManager.EXACT_FIT,//NO_SCALE, RESIZE, SHOW_ALL, EXACT_FIT
			fullScreenScaleMode: Phaser.ScaleManager.EXACT_FIT
		}

		ContextMenu.customItems = [new ContextMenuItem('Script4', Script4.VERSION)];

		Script4.imagesToPreLoader = (Script4.imagesToPreLoader) ? Script4.imagesToPreLoader : IMAGES;
		Script4.customPreloader = (Script4.customPreloader) ? Script4.customPreloader : PRELOADER;
		this.config = (configs) ? configs : CONFIGS;
	}

	static get VERSION() { return 'v0.6.1'; }

	static get width() { return Script4.core.width; }

	static get height() { return Script4.core.height; }

	static get juggler() { return this._juggler; }

	static set juggler(value) { this._juggler = value; }
	
	get getShowStats() { return this.showStats; }
	
	set setShowStats(bool) { this.showStats = bool; if (this.config) { this.config.enableDebug = bool; } }

	start() {
		Script4.core = this;
		console.log('Script4 ' + Script4.VERSION);

		Script4.juggler = new Juggler();

		this.state.add('Boot', new Boot);
		this.state.add(Script4.customPreloader.name, Script4.customPreloader.class);

		this.state.start('Boot');
	}

	removeContextMenu() {
		Script4.core.contextMenu.destroy();
		Script4.core.contextMenu = null;
	}

	render() {
		if (this.game.canvas && !this.game.canvas.oncontextmenu) {
			var _this = this;
			this.game.canvas.oncontextmenu = function (e) {
				e.preventDefault();
				if (_this.game.contextMenu) { _this.game.removeContextMenu(); }
				_this.game.contextMenu = new ContextMenu(e.layerX, e.layerY);
				_this.game.world.addChild(_this.game.contextMenu);
			}
			this.game.canvas.onclick = function (e) {
				if (_this.game.contextMenu) { _this.game.removeContextMenu(); }
			}
		}
		if (this.game.config.enableDebug){
			if (!this.game.time.advancedTiming) { this.game.time.advancedTiming = true; }
			this.game.debug.text('FPS: ' + this.game.time.fps, 4, 18, '#FFFFFF');
		}
	}

	addEventListener(type, listener) {
		if (!type) throw('event type not found!');
		window.addEventListener(type, listener);
	}

	removeEventListener(type, listener) {
		if (!type) throw('event type not found!');
		window.removeEventListener(type, listener);
	}

}