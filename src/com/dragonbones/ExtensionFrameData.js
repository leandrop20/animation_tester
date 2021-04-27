import { TweenFrameData } from './TweenFrameData';

export class ExtensionFrameData extends TweenFrameData {

	constructor() {
		super();

		this.tweens = [];
		this.keys = [];
	}

	static toString() {
        return "[class ExtensionFrameData]";
    }

    _onClear() {
        super._onClear();
        this.type = 0 /* FFD */;
        this.tweens.length = 0;
        this.keys.length = 0;
    }

}