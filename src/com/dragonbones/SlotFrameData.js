import { TweenFrameData } from './TweenFrameData';
import { ColorTransform } from './ColorTransform';

export class SlotFrameData extends TweenFrameData {

	constructor() {
		super();
	}

	static generateColor() {
        return new ColorTransform();
    }

    static toString() {
        return "[class SlotFrameData]";
    }

    _onClear() {
        super._onClear();
        this.displayIndex = 0;
        this.zOrder = 0;
        this.color = null;
    }

    static get DEFAULT_COLOR() { return (SlotFrameData._DEFAULT_COLOR) ? SlotFrameData._DEFAULT_COLOR : new ColorTransform(); }
    static set DEFAULT_COLOR(value) { SlotFrameData._DEFAULT_COLOR = value; }

}