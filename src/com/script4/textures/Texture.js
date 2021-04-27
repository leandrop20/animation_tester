import { BaseTexture } from "../textures/BaseTexture";

export class Texture {

	static empty(_width = 0, _height = 0) {
		return new PIXI.Texture(new BaseTexture(_width, _height));
	}

}