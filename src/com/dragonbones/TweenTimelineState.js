import { TimelineState } from './TimelineState';
import { DragonBones } from './DragonBones';

export class TweenTimelineState extends TimelineState {

	constructor() {
		super();
	}

	static _getEasingValue(progress, easing) {
        if (progress <= 0) {
            return 0;
        }
        else if (progress >= 1) {
            return 1;
        }
        var value = 1;
        if (easing > 2) {
            return progress;
        }
        else if (easing > 1) {
            value = 0.5 * (1 - Math.cos(progress * Math.PI));
            easing -= 1;
        }
        else if (easing > 0) {
            value = 1 - Math.pow(1 - progress, 2);
        }
        else if (easing >= -1) {
            easing *= -1;
            value = Math.pow(progress, 2);
        }
        else if (easing >= -2) {
            easing *= -1;
            value = Math.acos(1 - progress * 2) / Math.PI;
            easing -= 1;
        }
        else {
            return progress;
        }
        return (value - progress) * easing + progress;
    }

    static _getCurveEasingValue(progress, sampling) {
        if (progress <= 0) {
            return 0;
        }
        else if (progress >= 1) {
            return 1;
        }
        var x = 0;
        var y = 0;
        for (var i = 0, l = sampling.length; i < l; i += 2) {
            x = sampling[i];
            y = sampling[i + 1];
            if (x >= progress) {
                if (i == 0) {
                    return y * progress / x;
                }
                else {
                    var xP = sampling[i - 2];
                    var yP = sampling[i - 1]; // i - 2 + 1
                    return yP + (y - yP) * (progress - xP) / (x - xP);
                }
            }
        }
        return y + (1 - y) * (progress - x) / (1 - x);
    }

    _onClear() {
        super._onClear();
        this._tweenProgress = 0;
        this._tweenEasing = DragonBones.NO_TWEEN;
        this._curve = null;
    }

    _onArriveAtFrame(isUpdate) {
        var self = this;
        self._tweenEasing = self._currentFrame.tweenEasing;
        self._curve = self._currentFrame.curve;
        if (self._keyFrameCount <= 1 ||
            (self._currentFrame.next == self._timeline.frames[0] &&
                (self._tweenEasing != DragonBones.NO_TWEEN || self._curve) &&
                self._animationState.playTimes > 0 &&
                self._animationState.currentPlayTimes == self._animationState.playTimes - 1)) {
            self._tweenEasing = DragonBones.NO_TWEEN;
            self._curve = null;
        }
    }

    _onUpdateFrame(isUpdate) {
        var self = this;
        if (self._tweenEasing != DragonBones.NO_TWEEN) {
            self._tweenProgress = (self._currentTime - self._currentFrame.position + self._position) / self._currentFrame.duration;
            if (self._tweenEasing != 0) {
                self._tweenProgress = TweenTimelineState._getEasingValue(self._tweenProgress, self._tweenEasing);
            }
        }
        else if (self._curve) {
            self._tweenProgress = (self._currentTime - self._currentFrame.position + self._position) / self._currentFrame.duration;
            self._tweenProgress = TweenTimelineState._getCurveEasingValue(self._tweenProgress, self._curve);
        }
        else {
            self._tweenProgress = 0;
        }
    }

    _updateExtensionKeyFrame(current, next, result) {
        var tweenType = 0 /* None */;
        if (current.type == next.type) {
            for (var i = 0, l = current.tweens.length; i < l; ++i) {
                var tweenDuration = next.tweens[i] - current.tweens[i];
                result.tweens[i] = tweenDuration;
                if (tweenDuration != 0) {
                    tweenType = 2 /* Always */;
                }
            }
        }
        if (tweenType == 0 /* None */) {
            if (result.type != current.type) {
                tweenType = 1 /* Once */;
                result.type = current.type;
            }
            if (result.tweens.length != current.tweens.length) {
                tweenType = 1 /* Once */;
                result.tweens.length = current.tweens.length;
            }
            if (result.keys.length != current.keys.length) {
                tweenType = 1 /* Once */;
                result.keys.length = current.keys.length;
            }
            for (var i = 0, l = current.keys.length; i < l; ++i) {
                var key = current.keys[i];
                if (result.keys[i] != key) {
                    tweenType = 1 /* Once */;
                    result.keys[i] = key;
                }
            }
        }
        return tweenType;
    }

}