import { TimelineData } from './TimelineData';

export class FFDTimelineData extends TimelineData {

	constructor() {
		super();
	}

	static toString() {
        return "[class FFDTimelineData]";
    }

    _onClear() {
        super._onClear();
        this.displayIndex = 0;
        this.skin = null;
        this.slot = null;
    }

}