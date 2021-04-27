import { TweenFrameData } from './TweenFrameData';
import { Transform } from './Transform';

export class BoneFrameData extends TweenFrameData {

	constructor() {
		super();

		this.transform = new Transform();
	}

	static toString() {
        return "[class BoneFrameData]";
    }

    _onClear() {
        super._onClear();
        this.tweenScale = false;
        this.tweenRotate = 0;
        this.transform.identity();
    }

}