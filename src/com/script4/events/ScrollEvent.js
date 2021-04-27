export class ScrollEvent {

	static get TWEEN_COMPLETE() { return 'myTweenComplete'; }
	static get MASK_WIDTH() { return 'myMaskWidth'; }
	static get MASK_HEIGHT() { return 'myMaskHeight'; }
	static get ENTER_FRAME() { return 'myEnterFrame'; }
	
	static get MOUSE_DOWN() { return 'onMouseDown'; }
	static get MOUSE_MOVE() { return 'onMouseMove'; }
	static get MOUSE_UP() { return 'onMouseUp'; }

	static get TOUCH_TWEEN_UPDATE() { return 'touchTweenUpdate'; }
	static get TOUCH_TWEEN_COMPLETE() { return 'touchTweenComplete'; }

	constructor (type, data = null, bubbles = false, cancelable = false) {
		this._param = data;
	}

	get param() { return this._param; }
	
}