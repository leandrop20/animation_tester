export class Point extends Phaser.Point {

	constructor(x, y) {
		super(x, y);
	}

	multiply(x, y) {
		this.x *= x instanceof Point ? x.x : x;
        this.y *= x instanceof Point ? x.y : y || x;
		return this;
	}

	multiplyAdd(x, y) {
		this.x += x instanceof Point ? x.x * y : x * y;
        this.y += x instanceof Point ? x.y * y : x * y;
		return this;
	}
	
}