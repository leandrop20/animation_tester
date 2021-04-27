import { FrameData } from './FrameData';

export class TweenFrameData extends FrameData {

	constructor() {
		super();
	}

	static samplingCurve(curve, frameCount) {
        if (curve.length == 0 || frameCount == 0) {
            return null;
        }
        var samplingTimes = frameCount + 2;
        var samplingStep = 1 / samplingTimes;
        var sampling = new Array((samplingTimes - 1) * 2);
        //
        curve = curve.concat();
        curve.unshift(0, 0);
        curve.push(1, 1);
        var stepIndex = 0;
        for (var i = 0; i < samplingTimes - 1; ++i) {
            var step = samplingStep * (i + 1);
            while (curve[stepIndex + 6] < step) {
                stepIndex += 6;
            }
            var x1 = curve[stepIndex];
            var x4 = curve[stepIndex + 6];
            var t = (step - x1) / (x4 - x1);
            var l_t = 1 - t;
            var powA = l_t * l_t;
            var powB = t * t;
            var kA = l_t * powA;
            var kB = 3 * t * powA;
            var kC = 3 * l_t * powB;
            var kD = t * powB;
            sampling[i * 2] = kA * x1 + kB * curve[stepIndex + 2] + kC * curve[stepIndex + 4] + kD * x4;
            sampling[i * 2 + 1] = kA * curve[stepIndex + 1] + kB * curve[stepIndex + 3] + kC * curve[stepIndex + 5] + kD * curve[stepIndex + 7];
        }
        return sampling;
    }

    _onClear() {
        super._onClear();
        this.tweenEasing = 0;
        this.curve = null;
    }

}