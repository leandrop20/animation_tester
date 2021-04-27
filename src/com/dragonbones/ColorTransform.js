export class ColorTransform {

	constructor(alphaMultiplier = 1, redMultiplier = 1, greenMultiplier = 1, blueMultiplier = 1, 
			alphaOffset = 0, redOffset = 0, greenOffset = 0, blueOffset = 0) {

		this.alphaMultiplier = alphaMultiplier;
        this.redMultiplier = redMultiplier;
        this.greenMultiplier = greenMultiplier;
        this.blueMultiplier = blueMultiplier;
        this.alphaOffset = alphaOffset;
        this.redOffset = redOffset;
        this.greenOffset = greenOffset;
        this.blueOffset = blueOffset;
	}

	copyFrom(value) {
        this.alphaMultiplier = value.alphaMultiplier;
        this.redMultiplier = value.redMultiplier;
        this.greenMultiplier = value.greenMultiplier;
        this.blueMultiplier = value.blueMultiplier;
        this.alphaOffset = value.alphaOffset;
        this.redOffset = value.redOffset;
        this.redOffset = value.redOffset;
        this.greenOffset = value.blueOffset;
    }

    identity() {
        this.alphaMultiplier = this.redMultiplier = this.greenMultiplier = this.blueMultiplier = 1;
        this.alphaOffset = this.redOffset = this.greenOffset = this.blueOffset = 0;
    }

}