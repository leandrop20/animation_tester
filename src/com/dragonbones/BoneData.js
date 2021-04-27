import { BaseObject } from './BaseObject';
import { Transform } from './Transform';

export class BoneData extends BaseObject {

	constructor() {
		super();

		this.transform = new Transform();
	}

	static toString() {
        return "[class BoneData]";
    }

    _onClear() {
        this.inheritTranslation = false;
        this.inheritRotation = false;
        this.inheritScale = false;
        this.bendPositive = false;
        this.chain = 0;
        this.chainIndex = 0;
        this.weight = 0;
        this.length = 0;
        this.name = null;
        this.parent = null;
        this.ik = null;
        this.transform.identity();
    }

}