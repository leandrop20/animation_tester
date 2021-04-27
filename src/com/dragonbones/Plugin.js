export default class Plugin extends Phaser.Plugin {

	constructor(game, parent) {
		super(game, parent);
		this.addLoader();
	}

	addLoader() {
		Phaser.Loader.prototype.dragonbones = function(key, url, scalingVariant, group) {
			var path = url.substr(0, url.lastIndexOf("."));

			this.image(key, path + ".png");
			this.json(key, path + ".json");
			this.json(key + "Ske", path + "Ske.json");
		}
	}

}