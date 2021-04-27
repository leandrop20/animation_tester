import { BaseObject } from './BaseObject';

export class EventObject extends BaseObject {

	constructor() {
		super();
	}

	static toString() {
        return "[class EventObject]";
    }

    _onClear() {
        this.type = null;
        this.name = null;
        this.data = null;
        this.armature = null;
        this.bone = null;
        this.slot = null;
        this.animationState = null;
        this.frame = null;
        this.userData = null;
    }

    static get START() { return "start"; }
    static get LOOP_COMPLETE() { return "loopComplete"; }
    static get COMPLETE() { return "complete"; }
    static get FADE_IN() { return "fadeIn"; }
    static get FADE_IN_COMPLETE() { return "fadeInComplete"; }
    static get FADE_OUT() { return "fadeOut"; }
    static get FADE_OUT_COMPLETE() { return "fadeOutComplete"; }
    static get FRAME_EVENT() { return "frameEvent"; }
    static get SOUND_EVENT() { return "soundEvent"; }

}