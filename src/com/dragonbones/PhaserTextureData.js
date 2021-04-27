import { TextureData } from './TextureData';

export class PhaserTextureData extends TextureData {

	constructor() {
		super();
	}

	static toString() {
        return "[class PhaserTextureData]";
    }

    _onClear() {
        super._onClear();
        if (this.texture) {
            this.texture.destroy(false);
            this.texture = null;
        }
    }

}