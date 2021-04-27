import { BaseObject } from './BaseObject';

export class ActionData extends BaseObject {

	constructor() {
		super();

		this.data = [];
	}

	static toString() {
        return "[class ActionData]";
    }

    _onClear() {
        this.type = 0 /* Play */;
        this.bone = null;
        this.slot = null;
        this.data.length = 0;
    };

}