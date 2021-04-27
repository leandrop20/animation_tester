import { FrameData } from './FrameData';

export class AnimationFrameData extends FrameData {

	constructor() {
		super();

		this.actions = [];
		this.events = [];
	}

	static toString() {
        return "[class AnimationFrameData]";
    }

    _onClear() {
        super._onClear();
        for (var i = 0, l = this.actions.length; i < l; ++i) {
            this.actions[i].returnToPool();
        }
        for (var i = 0, l = this.events.length; i < l; ++i) {
            this.events[i].returnToPool();
        }
        this.actions.length = 0;
        this.events.length = 0;
    }

}