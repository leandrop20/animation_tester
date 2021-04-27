import { BaseObject } from './BaseObject';

export class SkinData extends BaseObject {

	constructor() {
		super();

		this.slots = {};
	}

	static toString() {
        return "[class SkinData]";
    }

    _onClear() {
        for (var i in this.slots) {
            this.slots[i].returnToPool();
            delete this.slots[i];
        }
        this.name = null;
    }

    addSlot(value) {
        if (value && value.slot && !this.slots[value.slot.name]) {
            this.slots[value.slot.name] = value;
        }
        else {
            throw new Error();
        }
    }

    getSlot(name) {
        return this.slots[name];
    }

}