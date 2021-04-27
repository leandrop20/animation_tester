import { BaseObject } from './BaseObject';

export class TimelineData extends BaseObject {

	constructor() {
		super();

		this.frames = [];
	}

	_onClear () {
        var prevFrame = null;
        for (var i = 0, l = this.frames.length; i < l; ++i) {
            var frame = this.frames[i];
            if (prevFrame && frame != prevFrame) {
                prevFrame.returnToPool();
            }
            prevFrame = frame;
        }
        this.scale = 1;
        this.offset = 0;
        this.frames.length = 0;
    }

}