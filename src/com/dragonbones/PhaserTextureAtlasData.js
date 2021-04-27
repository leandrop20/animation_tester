import { TextureAtlasData } from './TextureAtlasData';
import { PhaserTextureData } from './PhaserTextureData';
import { BaseObject } from './BaseObject';

export class PhaserTextureAtlasData extends TextureAtlasData {

	constructor() {
		super();
	}

	static toString() {
        return "[class PhaserTextureAtlasData]";
    }

    _onClear() {
        super._onClear();
        if (this.texture) {
            this.texture = null;
        }
    }

    generateTextureData() {
        return BaseObject.borrowObject(PhaserTextureData);
    }

}