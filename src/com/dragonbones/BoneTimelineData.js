import { TimelineData } from './TimelineData';
import { Transform } from './Transform';
import { Matrix } from './Matrix';

export class BoneTimelineData extends TimelineData {

	constructor() {
		super();

		this.originTransform = new Transform();
		this.cachedFrames = [];
	}

	static cacheFrame(cacheFrames, cacheFrameIndex, globalTransformMatrix) {
        var cacheMatrix = cacheFrames[cacheFrameIndex] = new Matrix();
        cacheMatrix.copyFrom(globalTransformMatrix);
        return cacheMatrix;
    }

    static toString() {
        return "[class BoneTimelineData]";
    }

    _onClear() {
        super._onClear();
        this.bone = null;
        this.originTransform.identity();
        this.cachedFrames.length = 0;
    }

    cacheFrames(cacheFrameCount) {
        this.cachedFrames.length = 0;
        this.cachedFrames.length = cacheFrameCount;
    }

}