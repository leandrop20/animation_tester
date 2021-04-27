import { BaseObject } from './BaseObject';
import { Rectangle } from './Rectangle';

export class TextureData extends BaseObject {

	constructor() {
		super();

		this.region = new Rectangle();
	}

	static generateRectangle() {
        return new Rectangle();
    }

    _onClear() {
        this.rotated = false;
        this.name = null;
        this.frame = null;
        this.parent = null;
        this.region.clear();
    }

}