import { TweenTimelineState } from './TweenTimelineState';
import { ColorTransform } from './ColorTransform';
import { DragonBones } from './DragonBones';

export class SlotTimelineState extends TweenTimelineState {

	constructor() {
		super();

		this._color = new ColorTransform();
		this._durationColor = new ColorTransform();
	}

	static toString() {
        return "[class SlotTimelineState]";
    }

    _onClear() {
        super._onClear();
        this.slot = null;
        this._colorDirty = false;
        this._tweenColor = 0 /* None */;
        this._slotColor = null;
        this._color.identity();
        this._durationColor.identity();
    }

    _onArriveAtFrame(isUpdate) {
        var self = this;
        super._onArriveAtFrame(isUpdate);
        if (self._animationState._isDisabled(self.slot)) {
            self._tweenEasing = DragonBones.NO_TWEEN;
            self._curve = null;
            self._tweenColor = 0 /* None */;
            return;
        }
        if (self.slot._displayDataSet) {
            var displayIndex = self._currentFrame.displayIndex;
            if (self.slot.displayIndex >= 0 && displayIndex >= 0) {
                if (self.slot._displayDataSet.displays.length > 1) {
                    self.slot._setDisplayIndex(displayIndex);
                }
            }
            else {
                self.slot._setDisplayIndex(displayIndex);
            }
            self.slot._updateMeshData(true);
        }
        if (self._currentFrame.displayIndex >= 0) {
            self._tweenColor = 0 /* None */;
            var currentColor = self._currentFrame.color;
            if (self._keyFrameCount > 1 && (self._tweenEasing != DragonBones.NO_TWEEN || self._curve)) {
                var nextFrame = self._currentFrame.next;
                var nextColor = nextFrame.color;
                if (currentColor != nextColor && nextFrame.displayIndex >= 0) {
                    self._durationColor.alphaMultiplier = nextColor.alphaMultiplier - currentColor.alphaMultiplier;
                    self._durationColor.redMultiplier = nextColor.redMultiplier - currentColor.redMultiplier;
                    self._durationColor.greenMultiplier = nextColor.greenMultiplier - currentColor.greenMultiplier;
                    self._durationColor.blueMultiplier = nextColor.blueMultiplier - currentColor.blueMultiplier;
                    self._durationColor.alphaOffset = nextColor.alphaOffset - currentColor.alphaOffset;
                    self._durationColor.redOffset = nextColor.redOffset - currentColor.redOffset;
                    self._durationColor.greenOffset = nextColor.greenOffset - currentColor.greenOffset;
                    self._durationColor.blueOffset = nextColor.blueOffset - currentColor.blueOffset;
                    if (self._durationColor.alphaMultiplier != 0 ||
                        self._durationColor.redMultiplier != 0 ||
                        self._durationColor.greenMultiplier != 0 ||
                        self._durationColor.blueMultiplier != 0 ||
                        self._durationColor.alphaOffset != 0 ||
                        self._durationColor.redOffset != 0 ||
                        self._durationColor.greenOffset != 0 ||
                        self._durationColor.blueOffset != 0) {
                        self._tweenColor = 2 /* Always */;
                    }
                }
            }
            if (self._tweenColor == 0 /* None */) {
                if (self._slotColor.alphaMultiplier != currentColor.alphaMultiplier ||
                    self._slotColor.redMultiplier != currentColor.redMultiplier ||
                    self._slotColor.greenMultiplier != currentColor.greenMultiplier ||
                    self._slotColor.blueMultiplier != currentColor.blueMultiplier ||
                    self._slotColor.alphaOffset != currentColor.alphaOffset ||
                    self._slotColor.redOffset != currentColor.redOffset ||
                    self._slotColor.greenOffset != currentColor.greenOffset ||
                    self._slotColor.blueOffset != currentColor.blueOffset) {
                    self._tweenColor = 1 /* Once */;
                }
            }
        }
        else {
            self._tweenEasing = DragonBones.NO_TWEEN;
            self._curve = null;
            self._tweenColor = 0 /* None */;
        }
    }

    _onUpdateFrame(isUpdate) {
        var self = this;
        super._onUpdateFrame(isUpdate);
        var tweenProgress = 0;
        if (self._tweenColor) {
            if (self._tweenColor == 1 /* Once */) {
                self._tweenColor = 0 /* None */;
                tweenProgress = 0;
            }
            else {
                tweenProgress = self._tweenProgress;
            }
            var currentColor = self._currentFrame.color;
            self._color.alphaMultiplier = currentColor.alphaMultiplier + self._durationColor.alphaMultiplier * tweenProgress;
            self._color.redMultiplier = currentColor.redMultiplier + self._durationColor.redMultiplier * tweenProgress;
            self._color.greenMultiplier = currentColor.greenMultiplier + self._durationColor.greenMultiplier * tweenProgress;
            self._color.blueMultiplier = currentColor.blueMultiplier + self._durationColor.blueMultiplier * tweenProgress;
            self._color.alphaOffset = currentColor.alphaOffset + self._durationColor.alphaOffset * tweenProgress;
            self._color.redOffset = currentColor.redOffset + self._durationColor.redOffset * tweenProgress;
            self._color.greenOffset = currentColor.greenOffset + self._durationColor.greenOffset * tweenProgress;
            self._color.blueOffset = currentColor.blueOffset + self._durationColor.blueOffset * tweenProgress;
            self._colorDirty = true;
        }
    }

    fadeIn(armature, animationState, timelineData, time) {
        super.fadeIn(armature, animationState, timelineData, time);
        this._slotColor = this.slot._colorTransform;
    }

    fadeOut() {
        this._tweenColor = 0 /* None */;
    }

    update(time) {
        var self = this;
        super.update(time);
        // Fade animation.
        if (self._tweenColor != 0 /* None */ || self._colorDirty) {
            var weight = self._animationState._weightResult;
            if (weight > 0) {
                var fadeProgress = self._animationState._fadeProgress;
                if (fadeProgress < 1) {
                    self._slotColor.alphaMultiplier += (self._color.alphaMultiplier - self._slotColor.alphaMultiplier) * fadeProgress;
                    self._slotColor.redMultiplier += (self._color.redMultiplier - self._slotColor.redMultiplier) * fadeProgress;
                    self._slotColor.greenMultiplier += (self._color.greenMultiplier - self._slotColor.greenMultiplier) * fadeProgress;
                    self._slotColor.blueMultiplier += (self._color.blueMultiplier - self._slotColor.blueMultiplier) * fadeProgress;
                    self._slotColor.alphaOffset += (self._color.alphaOffset - self._slotColor.alphaOffset) * fadeProgress;
                    self._slotColor.redOffset += (self._color.redOffset - self._slotColor.redOffset) * fadeProgress;
                    self._slotColor.greenOffset += (self._color.greenOffset - self._slotColor.greenOffset) * fadeProgress;
                    self._slotColor.blueOffset += (self._color.blueOffset - self._slotColor.blueOffset) * fadeProgress;
                    self.slot._colorDirty = true;
                }
                else if (self._colorDirty) {
                    self._colorDirty = false;
                    self._slotColor.alphaMultiplier = self._color.alphaMultiplier;
                    self._slotColor.redMultiplier = self._color.redMultiplier;
                    self._slotColor.greenMultiplier = self._color.greenMultiplier;
                    self._slotColor.blueMultiplier = self._color.blueMultiplier;
                    self._slotColor.alphaOffset = self._color.alphaOffset;
                    self._slotColor.redOffset = self._color.redOffset;
                    self._slotColor.greenOffset = self._color.greenOffset;
                    self._slotColor.blueOffset = self._color.blueOffset;
                    self.slot._colorDirty = true;
                }
            }
        }
    }

}