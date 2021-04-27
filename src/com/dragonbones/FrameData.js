import { BaseObject } from './BaseObject';

export class FrameData extends BaseObject {

	constructor() {
		super();
	}

	_onClear() {
        this.position = 0;
        this.duration = 0;
        this.prev = null;
        this.next = null;
    }

}