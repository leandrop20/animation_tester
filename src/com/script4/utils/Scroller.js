import { Script4 } from '../Script4';
import { Orientation } from './Orientation';
import { Easing } from './Easing';
import { TweenMax } from 'TweenMax';
import { ThrowPropsPlugin } from 'ThrowPropsPlugin';

export class Scroller {

	constructor() {
		TweenPlugin.activate([ThrowPropsPlugin]);
		this._propSaver = {};
		
		// input vars
		this._content;
		this._boundWidth = 100;
		this._boundHeight = 100;
		
		this._orientation = Orientation.AUTO;
		this._easeType = Easing.Expo_easeOut;
		this._duration = .5;
		
		this._holdArea = 10;
		this._isStickTouch = false;
		
		this._yPerc = 0;
		this._xPerc = 0;
		
		// needed vars
		this._time1, this._time2;
		this._y1, this._y2, this._yOverlap, this._yOffset;
		this._x1, this._x2, this._xOverlap, this._xOffset;
		
		this._easeTypeFunc = EaseLookup.find(this._easeType);
		
		this._touchPoint;
		this._holdAreaPoint;
		this._isHoldAreaDone = false; // if true, shows that we have got out of the hold area
		
		this._isScrollBegin = true;
	}
		
	startScroll($point) {
		this._touchPoint = $point;
		
		// this._isScrollBegin is true when user scrolls for the first time and each time he calls fling()
		if (this._isScrollBegin) {
			TweenLite.killTweensOf(this._content);
			this._holdAreaPoint = this._touchPoint;
			this._isHoldAreaDone = false; // so that on TouchPhase.MOVED check the this._holdArea
			
			// it doesn't matter what's the this._orientation mode, we don't do anything especial here, we just set the variables
			initScrollV(this);
			initScrollH(this);
			
			function initScrollV(_this) {
				_this._y1 = _this._y2 = _this._content.y;
				_this._yOffset = _this._touchPoint.y - _this._content.y;
				_this._yOverlap = Math.max(0, _this._content.height - _this._boundHeight);
				_this._time1 = _this._time2 = _this.getTimer();
			}
			
			function initScrollH(_this) {
				_this._x1 = _this._x2 = _this._content.x;
				_this._xOffset = _this._touchPoint.x - _this._content.x;
				_this._xOverlap = Math.max(0, _this._content.width - _this._boundWidth);
				_this._time1 = _this._time2 = _this.getTimer();
			}
			
			this._isScrollBegin = false; // set it to false, so the next time that user calls this function on TouchPhase.MOVED, function will do the rest
			// dispatchEvent(new ScrollEvent(ScrollEvent.MOUSE_DOWN));
			return;
		}
		
		// the above has happened for the first time on TouchPhase.BEGAN, so on TouchPhase.MOVED this._isScrollBegin is false and won't do the above if statment and do the following
		var diff;
		
		if (this._orientation == Orientation.VERTICAL) {
			if (!this._isHoldAreaDone) {
				diff = this._holdAreaPoint.y - this._touchPoint.y;
				diff = Math.sqrt(Math.pow(diff, 2)); // set to always get positive number
				if (diff < this._holdArea) return; // if user is moving around and still didn't move so much to get out of the this._holdArea boundaries, don't do the scroll animation
			}
			
			scrollVSetting(this);
		} else if (this._orientation == Orientation.HORIZONTAL) {
			if (!this._isHoldAreaDone) {
				diff = this._holdAreaPoint.x - this._touchPoint.x;
				diff = Math.sqrt(Math.pow(diff, 2)); // set to always get positive number
				if (diff < this._holdArea) return; // if user is moving around and still didn't move so much to get out of the this._holdArea boundaries, don't do the scroll animation
			}
			
			scrollHSetting(this);
		} else {// if it was AUTO
			if (!this._isHoldAreaDone) {
				// set diff 2 time according to x and y, so that if user moves in any direction, the diff amount will be added 
				diff = this._holdAreaPoint.y - this._touchPoint.y;
				diff += this._holdAreaPoint.x - this._touchPoint.x;
				diff = Math.sqrt(Math.pow(diff, 2)); // set to always get positive number
				if (diff < this._holdArea) return; // if user is moving around and still didn't move so much to get out of the this._holdArea boundaries, don't do the scroll animation
			}
			
			scrollVSetting(this);
			scrollHSetting(this);
		}
		
		function scrollVSetting(_this) {
			//if maskContent's position exceeds the bounds, make it drag only half as far with each mouse movement (like iPhone/iPad behavior)
			var y = _this._touchPoint.y - _this._yOffset;
			if (y > 0) {
				if (_this._isStickTouch) _this._content.y = 0;
				else _this._content.y = (y + 0) * 0.5;
			} else if (y < 0 - _this._yOverlap) {
				if (_this._isStickTouch) _this._content.y = (- _this._yOverlap);
				else _this._content.y = (y + 0 - _this._yOverlap) * 0.5;
			} else {
				_this._content.y = y;
			}
			
			//if the frame rate is too high, we won't be able to track the velocity as well, so only update the values 20 times per second
			var t = _this.getTimer();
			
			if (t - _this._time2 > 50) {
				_this._y2 = _this._y1;
				_this._time2 = _this._time1;
				_this._y1 = _this._content.y;
				_this._time1 = t;
			}
			
			_this.computeYPerc(); // to analyze this._yPerc
		}
		
		function scrollHSetting(_this) {
			//if maskContent's position exceeds the bounds, make it drag only half as far with each mouse movement (like iPhone/iPad behavior)
			var x = _this._touchPoint.x - _this._xOffset;
			if (x > 0) {
				if (_this._isStickTouch) _this._content.x = 0;
				else _this._content.x = (x + 0) * 0.5;
			} else if (x < 0 - _this._xOverlap) {
				if (_this._isStickTouch) _this._content.x = (- _this._xOverlap);
				else _this._content.x = (x + 0 - _this._xOverlap) * 0.5;
			} else {
				_this._content.x = x;
			}
			
			//if the frame rate is too high, we won't be able to track the velocity as well, so only update the values 20 times per second
			var t = _this.getTimer();
			if (t - _this._time2 > 50) {
				_this._x2 = _this._x1;
				_this._time2 = _this._time1;
				_this._x1 = _this._content.x;
				_this._time1 = t;
			}
			
			_this.computeXPerc(); // to analyze this._xPerc
		}
		
		this._isHoldAreaDone = true; // so that it won't check this._holdArea next time that we move if we got back to its boundaries, because we don't like it to stop our scroll animation unless we release our touch and touch to move again
		// dispatchEvent(new ScrollEvent(ScrollEvent.MOUSE_MOVE));
	}
		
	fling() {
		// user usually calls this function on TouchPhase.ENDED, so we dispatch MOUSE_UP here
		// dispatchEvent(new ScrollEvent(ScrollEvent.MOUSE_UP));
		
		
		var time = (this.getTimer() - this._time2) / 1000;
		if (time <= 0.020) time = 0.020;
		var yVelocity = (this._content.y - this._y2) / time;
		var xVelocity = (this._content.x - this._x2) / time;
		
		// set animation tolerance amount accroding to this._isStickTouch is true or false
		var tolerance = {
			minDuration:(this._isStickTouch) ? 0: .3,
			overShoot:(this._isStickTouch) ? 0: 1
		};

		ThrowPropsPlugin.to(this._content, {throwProps:{
							y:{velocity:yVelocity, max:0, min:0 - this._yOverlap, resistance:300},
							x:{velocity:xVelocity, max:0, min:0 - this._xOverlap, resistance:300}
							},
							onUpdate:this.onTweenUpdate, onUpdateParams: [this],
							onComplete:this.onTweenComplete, onCompleteParams: [this],
							ease:this._easeTypeFunc
							}, 10, tolerance.minDuration, tolerance.overShoot);
		
		this._isScrollBegin = true; // so that on the next scroll, scroller sets the touch begin settings in startScroll()
	}

	onTweenUpdate(_this) {
		_this.computeYPerc();
		_this.computeXPerc();
		
		// dispatchEvent(new ScrollEvent(ScrollEvent.TOUCH_TWEEN_UPDATE));
	}

	onTweenComplete(_this) {
		_this.computeYPerc();
		_this.computeXPerc();
		
		// dispatchEvent(new ScrollEvent(ScrollEvent.TOUCH_TWEEN_COMPLETE));
	}
		
	computeYPerc($manualPerc = false) {
		if (!this._content) return;
		if (this._orientation == Orientation.HORIZONTAL) return; // if this._orientation is not vertical or auto, just return
		if (this._content.height <= this._boundHeight) return; // if content is smaller than the boundaries, there's no reason to set any percent
		
		
		if ($manualPerc) {
			var yLoc = (this._yPerc * (this._content.height - this._boundHeight)) / 100; // Periodic Table-> this._yPerc / 100 = ? / this._content.height
			TweenMax.to(this._content, this._duration, { bezier:[ { y:this._content.y }, { y: - yLoc } ], ease:this._easeTypeFunc } );
			$manualPerc = false;
		} else {
			var diff = this._content.height - this._boundHeight; // the different amount between the 2 heights
			
			var currY = Math.sqrt(Math.pow(this._content.y, 2)); // set to always get positive number
			if (this._content.y > 0) currY = 0; // if touch scroll was scratching at start point, set currY to 0 obviously
			else if ( (- this._content.y) > diff) currY = diff; // if it was scratching at end point, set currY to diff obviously
			
			this._yPerc = currY * 100 / diff; // Periodic Table-> diff / 100 = currY / ?
		}
	}
		
	computeXPerc($manualPerc = false) {
		if (!this._content) return;
		if (this._orientation == Orientation.VERTICAL) return; // if this._orientation is not horizontal or auto, just return
		if (this._content.width <= this._boundWidth) return; // if content is smaller than the boundaries, there's no reason to set any percent
		
		if ($manualPerc) {
			var xLoc = (this._xPerc * (this._content.width - this._boundWidth)) / 100; // Periodic Table-> this._xPerc / 100 = ? / this._content.width
			TweenMax.to(this._content, this._duration, { bezier:[ { x:this._content.x }, { x: - xLoc } ], ease:this._easeTypeFunc } );
			$manualPerc = false;
		} else {
			var diff = this._content.width - this._boundWidth; // the different amount between the 2 widths
			
			var currX = Math.sqrt(Math.pow(this._content.x, 2)); // set to always get positive number
			if (this._content.x > 0) currX = 0; // if touch scroll was scratching at start point, set currX to 0 obviously
			else if ( (- this._content.x) > diff) currX = diff; // if it was scratching at end point, set currX to diff obviously
			
			this._xPerc = currX * 100 / diff; // Periodic Table-> diff / 100 = currX / ?
		}
	}
		
	get boundWidth() { return this._boundWidth; }
	
	set boundWidth(a) {
		if(a != this._boundWidth) {
			this._boundWidth = a;
			this._propSaver.boundWidth = this._boundWidth; // pass the new value to the value of the object property
			
			this.computeXPerc(true);
		}
	}
	
	get boundHeight() { return this._boundHeight; }
	
	set boundHeight(a) {
		if(a != this._boundHeight) {
			this._boundHeight = a;
			this._propSaver.boundHeight = this._boundHeight; // pass the new value to the value of the object property
			
			this.computeYPerc(true);
		}
	}
	
	get orientation() { return this._orientation; }
	
	set orientation(a) {
		if(a != this._orientation) {
			this._orientation = a;
			this._propSaver.orientation = this._orientation; // pass the new value to the value of the object property
		}
	}
	
	get easeType() { return this._easeType; }
	
	set easeType(a) {
		if(a != this._easeType) {
			this._easeType = a;
			this._easeTypeFunc = EaseLookup.find(this._easeType);
			this._propSaver.easeType = this._easeType; // pass the new value to the value of the object property
		}
	}
	
	get duration() { return this._duration; }
	
	set duration(a) {
		if(a != this._duration) {
			this._duration = a;
			this._propSaver.duration = this._duration; // pass the new value to the value of the object property
		}
	}
	
	get isStickTouch() { return this._isStickTouch; }
	
	set isStickTouch(a) {
		if(a != this._isStickTouch) {
			this._isStickTouch = a;
			this._propSaver.isStickTouch = this._isStickTouch; // pass the new value to the value of the object property
		}
	}
	
	get holdArea() { return this._holdArea; }
	
	set holdArea(a) {
		if(a != this._holdArea) {
			this._holdArea = a;
			this._propSaver.holdArea = this._holdArea; // pass the new value to the value of the object property
		}
	}
	
	get isHoldAreaDone() { return this._isHoldAreaDone; }
	
	set content(a) {
		this._content = a;
	}
	
	get yPerc() { return this._yPerc; }

	set yPerc(a) {
		if(a != this._yPerc) {
			this._yPerc = a;
			this._propSaver.yPerc = this._yPerc; // pass the new value to the value of the object property
			
			this.computeYPerc(true);
		}
	}
	
	get xPerc() { return this._xPerc; }
	
	set xPerc(a) {
		if(a != this._xPerc) {
			this._xPerc = a;
			this._propSaver.xPerc = this._xPerc; // pass the new value to the value of the object property
			
			this.computeXPerc(true);
		}
	}
	
	get exportProp() { return this._propSaver; }
	
	set importProp(a) {
		for (var prop in a) {
			this[prop] = a[prop];
		}
	}

	getTimer() { return new Date().getMilliseconds();/*Script4.core.time.elapsed;*/ }

}