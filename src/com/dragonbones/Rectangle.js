export class Rectangle {

	constructor(x = 0, y = 0, width = 0, height = 0) {
		this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
	}

	copyFrom(value) {
        this.x = value.x;
        this.y = value.y;
        this.width = value.width;
        this.height = value.height;
    }

    clear() {
        this.x = this.y = 0;
        this.width = this.height = 0;
    }

}