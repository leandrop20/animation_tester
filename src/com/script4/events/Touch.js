import { Script4 } from "../Script4";
import { Point } from "../geom/Point";

export class Touch {

	static get previous(){ return this._previous; }
	static set previous(target){ this._previous = target; }

	constructor(target, phase, globalX, globalY) {
		this.target = target;
		this.phase = phase;
		this.globalX = globalX;
		this.globalY = globalY;
	}

	getPreviousLocation(obj) {
		var point = new Point();
		var global = new Point(Script4.core.input.worldX, Script4.core.input.worldY);
		point.x = global.x - obj.x + obj.pivot.x;
		point.y = global.y - obj.y + obj.pivot.y;
		return point;
	}
	
}