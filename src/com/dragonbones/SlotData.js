import { BaseObject } from './BaseObject';
import { ColorTransform } from './ColorTransform';

export class SlotData extends BaseObject {

	constructor() {
		super();

		this.actions = [];
	}

	static generateColor() {
        return new ColorTransform();
    }

    static toString() {
        return "[class SlotData]";
    }

    _onClear() {
        for (var i = 0, l = this.actions.length; i < l; ++i) {
            this.actions[i].returnToPool();
        }
        this.displayIndex = 0;
        this.zOrder = 0;
        this.blendMode = 0 /* Normal */;
        this.name = null;
        this.parent = null;
        this.color = null;
        this.actions.length = 0;
    }

    static get DEFAULT_COLOR() { return (SlotData._DEFAULT_COLOR) ? SlotData._DEFAULT_COLOR : new ColorTransform(); }
    static set DEFAULT_COLOR(value) { SlotData._DEFAULT_COLOR = value; }

}