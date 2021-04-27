import { Point } from './Point';
import { Transform } from './Transform';
import { Matrix } from './Matrix';
import { DragonBones } from './DragonBones';

export class DataParser {

	constructor() {
		this._data = null;
        this._armature = null;
        this._skin = null;
        this._slotDisplayDataSet = null;
        this._mesh = null;
        this._animation = null;
        this._timeline = null;
        this._isOldData = false; // For 2.x ~ 3.x
        this._isGlobalTransform = false; // For 2.x ~ 3.x
        this._isAutoTween = false; // For 2.x ~ 3.x
        this._animationTweenEasing = 0; // For 2.x ~ 3.x
        this._timelinePivot = new Point(); // For 2.x ~ 3.x
        this._helpPoint = new Point();
        this._helpTransformA = new Transform();
        this._helpTransformB = new Transform();
        this._helpMatrix = new Matrix();
        this._rawBones = []; // For skinned mesh
	}

	static _getArmatureType(value) {
        switch (value.toLowerCase()) {
            case "stage":
                return 0 /* Armature */;
            case "armature":
                return 0 /* Armature */;
            case "movieclip":
                return 1 /* MovieClip */;
            default:
                return 0 /* Armature */;
        }
    }

    static _getDisplayType(value) {
        switch (value.toLowerCase()) {
            case "image":
                return 0 /* Image */;
            case "armature":
                return 1 /* Armature */;
            case "mesh":
                return 2 /* Mesh */;
            default:
                return 0 /* Image */;
        }
    }

    static _getBlendMode(value) {
        switch (value.toLowerCase()) {
            case "normal":
                return 0 /* Normal */;
            case "add":
                return 1 /* Add */;
            case "alpha":
                return 2 /* Alpha */;
            case "darken":
                return 3 /* Darken */;
            case "difference":
                return 4 /* Difference */;
            case "erase":
                return 5 /* Erase */;
            case "hardlight":
                return 6 /* HardLight */;
            case "invert":
                return 7 /* Invert */;
            case "layer":
                return 8 /* Layer */;
            case "lighten":
                return 9 /* Lighten */;
            case "multiply":
                return 10 /* Multiply */;
            case "overlay":
                return 11 /* Overlay */;
            case "screen":
                return 12 /* Screen */;
            case "subtract":
                return 13 /* Subtract */;
            default:
                return 0 /* Normal */;
        }
    }

    static _getActionType(value) {
        switch (value.toLowerCase()) {
            case "play":
                return 0 /* Play */;
            case "stop":
                return 1 /* Stop */;
            case "gotoandplay":
                return 2 /* GotoAndPlay */;
            case "gotoandstop":
                return 3 /* GotoAndStop */;
            case "fadein":
                return 4 /* FadeIn */;
            case "fadeout":
                return 5 /* FadeOut */;
            default:
                return 4 /* FadeIn */;
        }
    }

    _getTimelineFrameMatrix(animation, timeline, position, transform) {
        var frameIndex = Math.floor(position * animation.frameCount / animation.duration);
        if (timeline.frames.length == 1 || frameIndex >= timeline.frames.length) {
            transform.copyFrom(timeline.frames[0].transform);
        }
        else {
            var frame = timeline.frames[frameIndex];
            var tweenProgress = 0;
            if (frame.tweenEasing != DragonBones.NO_TWEEN) {
                tweenProgress = (position - frame.position) / frame.duration;
                if (frame.tweenEasing != 0) {
                    tweenProgress = TweenTimelineState._getEasingValue(tweenProgress, frame.tweenEasing);
                }
            }
            else if (frame.curve) {
                tweenProgress = (position - frame.position) / frame.duration;
                tweenProgress = TweenTimelineState._getCurveEasingValue(tweenProgress, frame.curve);
            }
            var nextFrame = frame.next;
            transform.x = nextFrame.transform.x - frame.transform.x;
            transform.y = nextFrame.transform.y - frame.transform.y;
            transform.skewX = Transform.normalizeRadian(nextFrame.transform.skewX - frame.transform.skewX);
            transform.skewY = Transform.normalizeRadian(nextFrame.transform.skewY - frame.transform.skewY);
            transform.scaleX = nextFrame.transform.scaleX - frame.transform.scaleX;
            transform.scaleY = nextFrame.transform.scaleY - frame.transform.scaleY;
            transform.x = frame.transform.x + transform.x * tweenProgress;
            transform.y = frame.transform.y + transform.y * tweenProgress;
            transform.skewX = frame.transform.skewX + transform.skewX * tweenProgress;
            transform.skewY = frame.transform.skewY + transform.skewY * tweenProgress;
            transform.scaleX = frame.transform.scaleX + transform.scaleX * tweenProgress;
            transform.scaleY = frame.transform.scaleY + transform.scaleY * tweenProgress;
        }
        transform.add(timeline.originTransform);
    }

    _globalToLocal(armature) {
        var keyFrames = [];
        var bones = armature.sortedBones.concat().reverse();
        for (var i = 0, l = bones.length; i < l; ++i) {
            var bone = bones[i];
            if (bone.parent) {
                bone.parent.transform.toMatrix(this._helpMatrix);
                this._helpMatrix.invert();
                this._helpMatrix.transformPoint(bone.transform.x, bone.transform.y, this._helpPoint);
                bone.transform.x = this._helpPoint.x;
                bone.transform.y = this._helpPoint.y;
                bone.transform.rotation -= bone.parent.transform.rotation;
            }
            for (var i_2 in armature.animations) {
                var animation = armature.animations[i_2];
                var timeline = animation.getBoneTimeline(bone.name);
                if (!timeline) {
                    continue;
                }
                var parentTimeline = bone.parent ? animation.getBoneTimeline(bone.parent.name) : null;
                this._helpTransformB.copyFrom(timeline.originTransform);
                keyFrames.length = 0;
                for (var i_3 = 0, l_2 = timeline.frames.length; i_3 < l_2; ++i_3) {
                    var frame = timeline.frames[i_3];
                    if (keyFrames.indexOf(frame) >= 0) {
                        continue;
                    }
                    keyFrames.push(frame);
                    if (parentTimeline) {
                        this._getTimelineFrameMatrix(animation, parentTimeline, frame.position, this._helpTransformA);
                        frame.transform.add(this._helpTransformB);
                        this._helpTransformA.toMatrix(this._helpMatrix);
                        this._helpMatrix.invert();
                        this._helpMatrix.transformPoint(frame.transform.x, frame.transform.y, this._helpPoint);
                        frame.transform.x = this._helpPoint.x;
                        frame.transform.y = this._helpPoint.y;
                        frame.transform.rotation -= this._helpTransformA.rotation;
                    }
                    else {
                        frame.transform.add(this._helpTransformB);
                    }
                    frame.transform.minus(bone.transform);
                    if (i_3 == 0) {
                        timeline.originTransform.copyFrom(frame.transform);
                        frame.transform.identity();
                    }
                    else {
                        frame.transform.minus(timeline.originTransform);
                    }
                }
            }
        }
    }

    _mergeFrameToAnimationTimeline(framePostion, actions, events) {
        var frameStart = Math.floor(framePostion * this._armature.frameRate); // uint()
        var frames = this._animation.frames;
        if (frames.length == 0) {
            var startFrame = BaseObject.borrowObject(AnimationFrameData); // Add start frame.
            startFrame.position = 0;
            if (this._animation.frameCount > 1) {
                frames.length = this._animation.frameCount + 1; // One more count for zero duration frame.
                var endFrame = BaseObject.borrowObject(AnimationFrameData); // Add end frame to keep animation timeline has two different frames atleast.
                endFrame.position = this._animation.frameCount / this._armature.frameRate;
                frames[0] = startFrame;
                frames[this._animation.frameCount] = endFrame;
            }
        }
        var insertedFrame = null;
        var replacedFrame = frames[frameStart];
        if (replacedFrame && (frameStart == 0 || frames[frameStart - 1] == replacedFrame.prev)) {
            insertedFrame = replacedFrame;
        }
        else {
            insertedFrame = BaseObject.borrowObject(AnimationFrameData); // Create frame.
            insertedFrame.position = frameStart / this._armature.frameRate;
            frames[frameStart] = insertedFrame;
            for (var i = frameStart + 1, l = frames.length; i < l; ++i) {
                if (replacedFrame && frames[i] == replacedFrame) {
                    frames[i] = null;
                }
            }
        }
        if (actions) {
            for (var i = 0, l = actions.length; i < l; ++i) {
                insertedFrame.actions.push(actions[i]);
            }
        }
        if (events) {
            for (var i = 0, l = events.length; i < l; ++i) {
                insertedFrame.events.push(events[i]);
            }
        }
        // Modify frame link and duration.
        var prevFrame = null;
        var nextFrame = null;
        for (var i = 0, l = frames.length; i < l; ++i) {
            var currentFrame = frames[i];
            if (currentFrame && nextFrame != currentFrame) {
                nextFrame = currentFrame;
                if (prevFrame) {
                    nextFrame.prev = prevFrame;
                    prevFrame.next = nextFrame;
                    prevFrame.duration = nextFrame.position - prevFrame.position;
                }
                prevFrame = nextFrame;
            }
            else {
                frames[i] = prevFrame;
            }
        }
        nextFrame.duration = this._animation.duration - nextFrame.position;
        nextFrame = frames[0];
        prevFrame.next = nextFrame;
        nextFrame.prev = prevFrame;
    }

    /**
     * @deprecated
     * @see BaseFactory#parseDragonBonesData()
     */
    static parseDragonBonesData(rawData) {
        return ObjectDataParser.getInstance().parseDragonBonesData(rawData);
    }

    /**
     * @deprecated
     * @see BaseFactory#parsetTextureAtlasData()
     */
    static parseTextureAtlasData (rawData, scale = 1) {
        var textureAtlasData = {};
        var subTextureList = rawData[DataParser.SUB_TEXTURE];
        for (var i = 0, len = subTextureList.length; i < len; i++) {
            var subTextureObject = subTextureList[i];
            var subTextureName = subTextureObject[DataParser.NAME];
            var subTextureRegion = new Rectangle();
            var subTextureFrame = null;
            subTextureRegion.x = subTextureObject[DataParser.X] / scale;
            subTextureRegion.y = subTextureObject[DataParser.Y] / scale;
            subTextureRegion.width = subTextureObject[DataParser.WIDTH] / scale;
            subTextureRegion.height = subTextureObject[DataParser.HEIGHT] / scale;
            if (DataParser.FRAME_WIDTH in subTextureObject) {
                subTextureFrame = new Rectangle();
                subTextureFrame.x = subTextureObject[DataParser.FRAME_X] / scale;
                subTextureFrame.y = subTextureObject[DataParser.FRAME_Y] / scale;
                subTextureFrame.width = subTextureObject[DataParser.FRAME_WIDTH] / scale;
                subTextureFrame.height = subTextureObject[DataParser.FRAME_HEIGHT] / scale;
            }
            textureAtlasData[subTextureName] = { region: subTextureRegion, frame: subTextureFrame, rotated: false };
        }
        return textureAtlasData;
    }

    static get DATA_VERSION_2_3() { return "2.3"; }
    static get DATA_VERSION_3_0() { return "3.0"; }
    static get DATA_VERSION_4_0() { return "4.0"; }
    static get DATA_VERSION() { return "4.5"; }
    static get TEXTURE_ATLAS() { return "TextureAtlas"; }
    static get SUB_TEXTURE() { return "SubTexture"; }
    static get FORMAT() { return "format"; }
    static get IMAGE_PATH() { return "imagePath"; }
    static get WIDTH() { return "width"; }
    static get HEIGHT() { return "height"; }
    static get ROTATED() { return "rotated"; }
    static get FRAME_X() { return "frameX"; }
    static get FRAME_Y() { return "frameY"; }
    static get FRAME_WIDTH() { return "frameWidth"; }
    static get FRAME_HEIGHT() { return "frameHeight"; }
    static get DRADON_BONES() { return "dragonBones"; }
    static get ARMATURE() { return "armature"; }
    static get BONE() { return "bone"; }
    static get IK() { return "ik"; }
    static get SLOT() { return "slot"; }
    static get SKIN() { return "skin"; }
    static get DISPLAY() { return "display"; }
    static get ANIMATION() { return "animation"; }
    static get FFD() { return "ffd"; }
    static get FRAME() { return "frame"; }
    static get PIVOT() { return "pivot"; }
    static get TRANSFORM() { return "transform"; }
    static get AABB() { return "aabb"; }
    static get COLOR() { return "color"; }
    static get FILTER() { return "filter"; }
    static get VERSION() { return "version"; }
    static get IS_GLOBAL() { return "isGlobal"; }
    static get FRAME_RATE() { return "frameRate"; }
    static get TYPE() { return "type"; }
    static get NAME() { return "name"; }
    static get PARENT() { return "parent"; }
    static get LENGTH() { return "length"; }
    static get DATA() { return "data"; }
    static get DISPLAY_INDEX() { return "displayIndex"; }
    static get Z_ORDER() { return "z"; }
    static get BLEND_MODE() { return "blendMode"; }
    static get INHERIT_TRANSLATION() { return "inheritTranslation"; }
    static get INHERIT_ROTATION() { return "inheritRotation"; }
    static get INHERIT_SCALE() { return "inheritScale"; }
    static get TARGET() { return "target"; }
    static get BEND_POSITIVE() { return "bendPositive"; }
    static get CHAIN() { return "chain"; }
    static get WEIGHT() { return "weight"; }
    static get FADE_IN_TIME() { return "fadeInTime"; }
    static get PLAY_TIMES() { return "playTimes"; }
    static get SCALE() { return "scale"; }
    static get OFFSET() { return "offset"; }
    static get POSITION() { return "position"; }
    static get DURATION() { return "duration"; }
    static get TWEEN_EASING() { return "tweenEasing"; }
    static get TWEEN_ROTATE() { return "tweenRotate"; }
    static get TWEEN_SCALE() { return "tweenScale"; }
    static get CURVE() { return "curve"; }
    static get EVENT() { return "event"; }
    static get SOUND() { return "sound"; }
    static get ACTION() { return "action"; }
    static get ACTIONS() { return "actions"; }
    static get DEFAULT_ACTIONS() { return "defaultActions"; }
    static get X() { return "x"; }
    static get Y() { return "y"; }
    static get SKEW_X() { return "skX"; }
    static get SKEW_Y() { return "skY"; }
    static get SCALE_X() { return "scX"; }
    static get SCALE_Y() { return "scY"; }
    static get ALPHA_OFFSET() { return "aO"; }
    static get RED_OFFSET() { return "rO"; }
    static get GREEN_OFFSET() { return "gO"; }
    static get BLUE_OFFSET() { return "bO"; }
    static get ALPHA_MULTIPLIER() { return "aM"; }
    static get RED_MULTIPLIER() { return "rM"; }
    static get GREEN_MULTIPLIER() { return "gM"; }
    static get BLUE_MULTIPLIER() { return "bM"; }
    static get UVS() { return "uvs"; }
    static get VERTICES() { return "vertices"; }
    static get TRIANGLES() { return "triangles"; }
    static get WEIGHTS() { return "weights"; }
    static get SLOT_POSE() { return "slotPose"; }
    static get BONE_POSE() { return "bonePose"; }
    static get TWEEN() { return "tween"; }
    static get KEY() { return "key"; }
    static get COLOR_TRANSFORM() { return "colorTransform"; }
    static get TIMELINE() { return "timeline"; }
    static get PIVOT_X() { return "pX"; }
    static get PIVOT_Y() { return "pY"; }
    static get LOOP() { return "loop"; }
    static get AUTO_TWEEN() { return "autoTween"; }
    static get HIDE() { return "hide"; }
    static get RECTANGLE() { return "rectangle"; }
    static get ELLIPSE() { return "ellipse"; }

}