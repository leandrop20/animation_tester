import { BaseObject } from './BaseObject';

export class SlotDisplayDataSet extends BaseObject {

	constructor() {
		super();

		this.displays = [];
	}

	static toString() {
        return "[class SlotDisplayDataSet]";
    }

    _onClear() {
        for (var i = 0, l = this.displays.length; i < l; ++i) {
            this.displays[i].returnToPool();
        }
        this.slot = null;
        this.displays.length = 0;
    }

}