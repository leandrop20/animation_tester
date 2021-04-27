import { TimelineData } from './TimelineData';
import { Matrix } from './Matrix';

export class SlotTimelineData extends TimelineData {

	constructor() {
		super();

		this.cachedFrames = [];
	}

	static cacheFrame(cacheFrames, cacheFrameIndex, globalTransformMatrix) {
        var cacheMatrix = cacheFrames[cacheFrameIndex] = new Matrix();
        cacheMatrix.copyFrom(globalTransformMatrix);
        return cacheMatrix;
    }

    static toString() {
        return "[class SlotTimelineData]";
    }

    _onClear() {
        super._onClear();
        this.slot = null;
        this.cachedFrames.length = 0;
    }

    cacheFrames(cacheFrameCount) {
        this.cachedFrames.length = 0;
        this.cachedFrames.length = cacheFrameCount;
    }

}