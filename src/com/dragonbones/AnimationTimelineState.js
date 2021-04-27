import { TimelineState } from './TimelineState';
import { EventObject } from './EventObject';

export class AnimationTimelineState extends TimelineState {

	constructor() {
		super();
	}

	static toString() {
        return "[class AnimationTimelineState]";
    }

    _onClear() {
        super._onClear();
        this._isStarted = false;
    }

    _onCrossFrame(frame) {
        var self = this;
        if (this._animationState.actionEnabled) {
            var actions = frame.actions;
            for (var i = 0, l = actions.length; i < l; ++i) {
                self._armature._bufferAction(actions[i]);
            }
        }
        var eventDispatcher = self._armature._display;
        var events = frame.events;
        for (var i = 0, l = events.length; i < l; ++i) {
            var eventData = events[i];
            var eventType = "";
            switch (eventData.type) {
                case 10 /* Frame */:
                    eventType = EventObject.FRAME_EVENT;
                    break;
                case 11 /* Sound */:
                    eventType = EventObject.SOUND_EVENT;
                    break;
            }
            if ((eventData.type == 11 /* Sound */ ?
                this._armature._eventManager : eventDispatcher).hasEvent(eventType)) {
                var eventObject = BaseObject.borrowObject(EventObject);
                eventObject.animationState = self._animationState;
                eventObject.frame = frame;
                if (eventData.bone) {
                    eventObject.bone = self._armature.getBone(eventData.bone.name);
                }
                if (eventData.slot) {
                    eventObject.slot = self._armature.getSlot(eventData.slot.name);
                }
                eventObject.name = eventData.name;
                eventObject.data = eventData.data;
                self._armature._bufferEvent(eventObject, eventType);
            }
        }
    }

    fadeIn(armature, animationState, timelineData, time) {
        super.fadeIn(armature, animationState, timelineData, time);
        this._currentTime = time; // Pass first update. (armature.advanceTime(0))
    }

    update(time) {
        var self = this;
        var prevTime = self._currentTime;
        var prevPlayTimes = self._currentPlayTimes;
        if (!self._isCompleted && self._setCurrentTime(time)) {
            var eventDispatcher = self._armature._display;
            if (!self._isStarted) {
                self._isStarted = true;
                if (eventDispatcher.hasEvent(EventObject.START)) {
                    var eventObject = BaseObject.borrowObject(EventObject);
                    eventObject.animationState = self._animationState;
                    self._armature._bufferEvent(eventObject, EventObject.START);
                }
            }
            if (self._keyFrameCount) {
                var currentFrameIndex = self._keyFrameCount > 1 ? Math.floor(self._currentTime * self._frameRate) : 0;
                var currentFrame = self._timeline.frames[currentFrameIndex];
                if (self._currentFrame != currentFrame) {
                    if (self._keyFrameCount > 1) {
                        var crossedFrame = self._currentFrame;
                        self._currentFrame = currentFrame;
                        if (!crossedFrame) {
                            var prevFrameIndex = Math.floor(prevTime * self._frameRate);
                            crossedFrame = self._timeline.frames[prevFrameIndex];
                            if (self._isReverse) {
                            }
                            else {
                                if (prevTime <= crossedFrame.position ||
                                    prevPlayTimes != self._currentPlayTimes) {
                                    crossedFrame = crossedFrame.prev;
                                }
                            }
                        }
                        // TODO 1 2 3 key frame loop, first key frame after loop complete.
                        if (self._isReverse) {
                            while (crossedFrame != currentFrame) {
                                self._onCrossFrame(crossedFrame);
                                crossedFrame = crossedFrame.prev;
                            }
                        }
                        else {
                            while (crossedFrame != currentFrame) {
                                crossedFrame = crossedFrame.next;
                                self._onCrossFrame(crossedFrame);
                            }
                        }
                    }
                    else {
                        self._currentFrame = currentFrame;
                        self._onCrossFrame(self._currentFrame);
                    }
                }
            }
            if (prevPlayTimes != self._currentPlayTimes) {
                if (eventDispatcher.hasEvent(EventObject.LOOP_COMPLETE)) {
                    var eventObject = BaseObject.borrowObject(EventObject);
                    eventObject.animationState = self._animationState;
                    self._armature._bufferEvent(eventObject, EventObject.LOOP_COMPLETE);
                }
                if (self._isCompleted && eventDispatcher.hasEvent(EventObject.COMPLETE)) {
                    var eventObject = BaseObject.borrowObject(EventObject);
                    eventObject.animationState = self._animationState;
                    self._armature._bufferEvent(eventObject, EventObject.COMPLETE);
                }
                self._currentFrame = null;
            }
        }
    }

    setCurrentTime(value) {
        this._setCurrentTime(value);
        this._currentFrame = null;
    }

}