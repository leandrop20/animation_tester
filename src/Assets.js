// import { Configs } from './Configs';

export class Assets {

	static get baseURL() { 
		if (!Assets._baseURL) {
			for (let s of document.querySelectorAll('script')) {
				if (s.src.indexOf('game.js') !== -1) {
					Assets._baseURL = s.src.replace('game.js', '');
				}
			}
		}

		return Assets._baseURL;
	}

	/**
	* name string
	* path string
	* type string (image, audio, spine, atlas, bitmapfont, particle, xml)
	*/
	static get ASSETS() {
		return [
			{ name:'btImage', path:'assets/images/btImage.png', type:'image' },
			{ name:'btJson', path:'assets/images/btJson.png', type:'image' },
			{ name:'btAtlas', path:'assets/images/btAtlas.png', type:'image' },
			{ name:'btPrev', path:'assets/images/btPrev.png', type:'image' },
			{ name:'btPlay', path:'assets/images/btPlay.png', type:'image' },
			{ name:'btNext', path:'assets/images/btNext.png', type:'image' },
			// { name:'spriteAll', path:'assets/images/spriteAll.json', type:'atlas' },
			////////////////////////// ANIMATIONS ////////////////////////////////////////////
			// { name:'centopeia', path:'assets/animations/centopeia.json', type:'spine' },
			// { name:'chico', path:'assets/animations/chico.json', type:'dragonbones' },
			////////////////////////// FONTS /////////////////////////////////////////////////
			// { name:'fontHelp', path:'assets/fonts/fontHelp.xml', type:'bitmapfont' },
			////////////////////////// PARTICLES /////////////////////////////////////////////
			// { name:'candyVanished', path:'assets/particles/candyVanished.png', type:'particle'},
			////////////////////////// SOUNDS ////////////////////////////////////////////////
			// { name:'mMenu', path:'assets/audios/musics/mMenu.mp3', type:'audio' },
			////////////////////////// FXs ///////////////////////////////////////////////////
			// { name:'fx_acerto', path:'assets/audios/fx/fx_acerto.mp3', type:'audio' },
			////////////////////////// XMLs //////////////////////////////////////////////////
			// { name:'configs', path:'assets/xmls/configs.xml', type:'xml' }
		];
	}
	
}