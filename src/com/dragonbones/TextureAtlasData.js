import { BaseObject } from './BaseObject';

export class TextureAtlasData extends BaseObject {

	constructor() {
		super();

		this.textures = {};
	}

	_onClear() {
        for (var i in this.textures) {
            this.textures[i].returnToPool();
            delete this.textures[i];
        }
        this.autoSearch = false;
        this.scale = 1;
        this.name = null;
        this.imagePath = null;
    }

    addTexture(value) {
        if (value && value.name && !this.textures[value.name]) {
            this.textures[value.name] = value;
            value.parent = this;
        }
        else {
            throw new Error();
        }
    }

    getTexture(name) {
        return this.textures[name];
    }

}