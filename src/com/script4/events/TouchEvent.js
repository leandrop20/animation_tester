import { Script4 } from '../Script4';
import { Touch } from "./Touch";
import { TouchPhase } from "./TouchPhase";
import { Sprite } from "../display/Sprite";
import { Spine } from "../display/Spine";
import { Rectangle } from "../utils/Rectangle";
import { Point } from "../geom/Point";

export class TouchEvent {

	constructor(type, target, currentTarget) {
		this.type = type;
		this.target = target;
		this.currentTarget = currentTarget;
	}

	static get TOUCH() { return 'touch'; };

	getTouch(target, swap = false) {
		if (!target || target.game == null) { return; }
		
		var globalX = target.game.input.x;
		var globalY = target.game.input.y;

		if (this.type == TouchPhase.BEGAN) { Touch.previous = null; }

		if (Touch.previous) { target = Touch.previous; }

		if (!Touch.previous || Touch.previous == undefined) {
			return getObjTouch(target, this);
		} else {
			var point = centerDrag(Touch.previous);
			var endTouch = new Touch(Touch.previous, this.type, point.x, point.y);
			if (this.type == TouchPhase.ENDED) { Touch.previous = null; }
			return endTouch;
		}

		function getObjTouch(_target, _this) {
			if (!_target) { return; }

			if (_target instanceof Sprite || _target instanceof Spine 
					|| _target instanceof Phaser.Group) {
				var obj;
				for (var i = _target.numChildren - 1; i > -1; i--) {
					obj = _target.getChildAt(i);

					if (isIntersects(obj) && (obj.inputEnabled || obj.inputEnableChildren)) {
						if (_this.currentTarget == obj) {
							if (_this.type == TouchPhase.BEGAN) { Touch.previous = obj; }
							var point = centerDrag(obj);
							if (_target.getIndex(obj) != (_target.numChildren-1) 
									&& _this.type == TouchPhase.BEGAN && swap) {
								var lastObj = _target.getChildAt(_target.numChildren - 1);
								_target.addChild(obj);
							}

							return new Touch(obj, _this.type, point.x, point.y);
						} else {
							var objTouch = getObjTouch(obj, _this);
							if (objTouch != null) return objTouch;
						}
					}
				}
				return null;
			} else if (isIntersects(_target) && (_target.inputEnabled || _target.inputEnableChildren)) {
				if (_this.type == TouchPhase.BEGAN) { Touch.previous = _target; }
				var point = centerDrag(_target);

				return new Touch(_target, _this.type, point.x, point.y);
			}
		}

		function centerDrag(_target) {
			try {
				var boundsCenterLocalCoord = new Phaser.InputHandler(Script4.core).globalToLocal(new Phaser.Point(_target.centerX, _target.centerY));
				globalX = globalX + (_target.x - boundsCenterLocalCoord.x);
	            globalY = globalY + (_target.y - boundsCenterLocalCoord.y);
	        } catch (e) {
	        	//Error
	        }
			return new Point(globalX, globalY);
		}

		function isIntersects(_target) {
			if (_target.getBounds().intersects(new Rectangle(globalX, globalY, 1, 1))) {
				return true;
			}
			return false;
		}

		return null;
	}
	
}