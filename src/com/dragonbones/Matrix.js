export class Matrix {

	constructor(a = 1, b = 0, c = 0, d = 1, tx = 0, ty = 0) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.tx = tx;
        this.ty = ty;
	}

	/**
     * @version DragonBones 3.0
     */
    copyFrom(value) {
        this.a = value.a;
        this.b = value.b;
        this.c = value.c;
        this.d = value.d;
        this.tx = value.tx;
        this.ty = value.ty;
    }

    /**
     * @version DragonBones 3.0
     */
    identity() {
        this.a = this.d = 1;
        this.b = this.c = 0;
        this.tx = this.ty = 0;
    }

    /**
     * @version DragonBones 3.0
     */
    concat(value) {
        var aA = this.a;
        var bA = this.b;
        var cA = this.c;
        var dA = this.d;
        var txA = this.tx;
        var tyA = this.ty;
        var aB = value.a;
        var bB = value.b;
        var cB = value.c;
        var dB = value.d;
        var txB = value.tx;
        var tyB = value.ty;
        this.a = aA * aB + bA * cB;
        this.b = aA * bB + bA * dB;
        this.c = cA * aB + dA * cB;
        this.d = cA * bB + dA * dB;
        this.tx = aB * txA + cB * tyA + txB;
        this.ty = dB * tyA + bB * txA + tyB;
        /*
        [
            this.a,
            this.b,
            this.c,
            this.d,
            this.tx,
            this.ty
        ] = [
            this.a * value.a + this.b * value.c,
            this.a * value.b + this.b * value.d,
            this.c * value.a + this.d * value.c,
            this.c * value.b + this.d * value.d,
            value.a * this.tx + value.c * this.tx + value.tx,
            value.d * this.ty + value.b * this.ty + value.ty
        ];
        */
    }

    /**
     * @version DragonBones 3.0
     */
    invert() {
        var aA = this.a;
        var bA = this.b;
        var cA = this.c;
        var dA = this.d;
        var txA = this.tx;
        var tyA = this.ty;
        var n = aA * dA - bA * cA;
        this.a = dA / n;
        this.b = -bA / n;
        this.c = -cA / n;
        this.d = aA / n;
        this.tx = (cA * tyA - dA * txA) / n;
        this.ty = -(aA * tyA - bA * txA) / n;
    }

    /**
     * @version DragonBones 3.0
     */
    transformPoint(x, y, result, delta = false) {
        result.x = this.a * x + this.c * y;
        result.y = this.b * x + this.d * y;
        if (!delta) {
            result.x += this.tx;
            result.y += this.ty;
        }
    }

}