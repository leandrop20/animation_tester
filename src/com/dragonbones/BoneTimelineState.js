import { TweenTimelineState } from './TweenTimelineState';
import { Transform } from './Transform';
import { DragonBones } from './DragonBones';

export class BoneTimelineState extends TweenTimelineState {

	constructor() {
		super();

		this._transform = new Transform();
        this._currentTransform = new Transform();
        this._durationTransform = new Transform();
	}

	static toString() {
        return "[class BoneTimelineState]";
    }

    _onClear() {
        super._onClear();
        this.bone = null;
        this._tweenTransform = 0 /* None */;
        this._tweenRotate = 0 /* None */;
        this._tweenScale = 0 /* None */;
        this._boneTransform = null;
        this._originTransform = null;
        this._transform.identity();
        this._currentTransform.identity();
        this._durationTransform.identity();
    }

    _onArriveAtFrame(isUpdate) {
        var self = this;
        super._onArriveAtFrame(isUpdate);
        self._currentTransform.copyFrom(self._currentFrame.transform);
        self._tweenTransform = 1 /* Once */;
        self._tweenRotate = 1 /* Once */;
        self._tweenScale = 1 /* Once */;
        if (self._keyFrameCount > 1 && (self._tweenEasing != DragonBones.NO_TWEEN || self._curve)) {
            var nextFrame = self._currentFrame.next;
            var nextTransform = nextFrame.transform;
            // Transform.
            self._durationTransform.x = nextTransform.x - self._currentTransform.x;
            self._durationTransform.y = nextTransform.y - self._currentTransform.y;
            if (self._durationTransform.x != 0 || self._durationTransform.y != 0) {
                self._tweenTransform = 2 /* Always */;
            }
            // Rotate.
            var tweenRotate = self._currentFrame.tweenRotate;
            if (tweenRotate == tweenRotate) {
                if (tweenRotate) {
                    if (tweenRotate > 0 ? nextTransform.skewY >= self._currentTransform.skewY : nextTransform.skewY <= self._currentTransform.skewY) {
                        var rotate = tweenRotate > 0 ? tweenRotate - 1 : tweenRotate + 1;
                        self._durationTransform.skewX = nextTransform.skewX - self._currentTransform.skewX + DragonBones.PI_D * rotate;
                        self._durationTransform.skewY = nextTransform.skewY - self._currentTransform.skewY + DragonBones.PI_D * rotate;
                    }
                    else {
                        self._durationTransform.skewX = nextTransform.skewX - self._currentTransform.skewX + DragonBones.PI_D * tweenRotate;
                        self._durationTransform.skewY = nextTransform.skewY - self._currentTransform.skewY + DragonBones.PI_D * tweenRotate;
                    }
                }
                else {
                    self._durationTransform.skewX = Transform.normalizeRadian(nextTransform.skewX - self._currentTransform.skewX);
                    self._durationTransform.skewY = Transform.normalizeRadian(nextTransform.skewY - self._currentTransform.skewY);
                }
                if (self._durationTransform.skewX != 0 || self._durationTransform.skewY != 0) {
                    self._tweenRotate = 2 /* Always */;
                }
            }
            else {
                self._durationTransform.skewX = 0;
                self._durationTransform.skewY = 0;
            }
            // Scale.
            if (self._currentFrame.tweenScale) {
                self._durationTransform.scaleX = nextTransform.scaleX - self._currentTransform.scaleX;
                self._durationTransform.scaleY = nextTransform.scaleY - self._currentTransform.scaleY;
                if (self._durationTransform.scaleX != 0 || self._durationTransform.scaleY != 0) {
                    self._tweenScale = 2 /* Always */;
                }
            }
            else {
                self._durationTransform.scaleX = 0;
                self._durationTransform.scaleY = 0;
            }
        }
        else {
            self._durationTransform.x = 0;
            self._durationTransform.y = 0;
            self._durationTransform.skewX = 0;
            self._durationTransform.skewY = 0;
            self._durationTransform.scaleX = 0;
            self._durationTransform.scaleY = 0;
        }
    }

    _onUpdateFrame(isUpdate) {
        var self = this;
        if (self._tweenTransform || self._tweenRotate || self._tweenScale) {
            super._onUpdateFrame(isUpdate);
            var tweenProgress = 0;
            if (self._tweenTransform) {
                if (self._tweenTransform == 1 /* Once */) {
                    self._tweenTransform = 0 /* None */;
                    tweenProgress = 0;
                }
                else {
                    tweenProgress = self._tweenProgress;
                }
                if (self._animationState.additiveBlending) {
                    self._transform.x = self._currentTransform.x + self._durationTransform.x * tweenProgress;
                    self._transform.y = self._currentTransform.y + self._durationTransform.y * tweenProgress;
                }
                else {
                    self._transform.x = self._originTransform.x + self._currentTransform.x + self._durationTransform.x * tweenProgress;
                    self._transform.y = self._originTransform.y + self._currentTransform.y + self._durationTransform.y * tweenProgress;
                }
            }
            if (self._tweenRotate) {
                if (self._tweenRotate == 1 /* Once */) {
                    self._tweenRotate = 0 /* None */;
                    tweenProgress = 0;
                }
                else {
                    tweenProgress = self._tweenProgress;
                }
                if (self._animationState.additiveBlending) {
                    self._transform.skewX = self._currentTransform.skewX + self._durationTransform.skewX * tweenProgress;
                    self._transform.skewY = self._currentTransform.skewY + self._durationTransform.skewY * tweenProgress;
                }
                else {
                    self._transform.skewX = self._originTransform.skewX + self._currentTransform.skewX + self._durationTransform.skewX * tweenProgress;
                    self._transform.skewY = self._originTransform.skewY + self._currentTransform.skewY + self._durationTransform.skewY * tweenProgress;
                }
            }
            if (self._tweenScale) {
                if (self._tweenScale == 1 /* Once */) {
                    self._tweenScale = 0 /* None */;
                    tweenProgress = 0;
                }
                else {
                    tweenProgress = self._tweenProgress;
                }
                if (self._animationState.additiveBlending) {
                    self._transform.scaleX = self._currentTransform.scaleX + self._durationTransform.scaleX * tweenProgress;
                    self._transform.scaleY = self._currentTransform.scaleY + self._durationTransform.scaleY * tweenProgress;
                }
                else {
                    self._transform.scaleX = self._originTransform.scaleX * (self._currentTransform.scaleX + self._durationTransform.scaleX * tweenProgress);
                    self._transform.scaleY = self._originTransform.scaleY * (self._currentTransform.scaleY + self._durationTransform.scaleY * tweenProgress);
                }
            }
            self.bone.invalidUpdate();
        }
    }

    fadeIn(armature, animationState, timelineData, time) {
        super.fadeIn(armature, animationState, timelineData, time);
        this._originTransform = this._timeline.originTransform;
        this._boneTransform = this.bone._animationPose;
    }

    fadeOut() {
        this._transform.skewX = Transform.normalizeRadian(this._transform.skewX);
        this._transform.skewY = Transform.normalizeRadian(this._transform.skewY);
    }

    update(time) {
        var self = this;
        super.update(time);
        // Blend animation state.
        var weight = self._animationState._weightResult;
        if (weight > 0) {
            if (self.bone._blendIndex == 0) {
                self._boneTransform.x = self._transform.x * weight;
                self._boneTransform.y = self._transform.y * weight;
                self._boneTransform.skewX = self._transform.skewX * weight;
                self._boneTransform.skewY = self._transform.skewY * weight;
                self._boneTransform.scaleX = (self._transform.scaleX - 1) * weight + 1;
                self._boneTransform.scaleY = (self._transform.scaleY - 1) * weight + 1;
            }
            else {
                self._boneTransform.x += self._transform.x * weight;
                self._boneTransform.y += self._transform.y * weight;
                self._boneTransform.skewX += self._transform.skewX * weight;
                self._boneTransform.skewY += self._transform.skewY * weight;
                self._boneTransform.scaleX += (self._transform.scaleX - 1) * weight;
                self._boneTransform.scaleY += (self._transform.scaleY - 1) * weight;
            }
            self.bone._blendIndex++;
            var fadeProgress = self._animationState._fadeProgress;
            if (fadeProgress < 1) {
                self.bone.invalidUpdate();
            }
        }
    }

}