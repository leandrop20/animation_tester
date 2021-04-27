export class Point {

	constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
	}

	copyFrom(value) {
        this.x = value.x;
        this.y = value.y;
    }

    clear() {
        this.x = this.y = 0;
    }

}