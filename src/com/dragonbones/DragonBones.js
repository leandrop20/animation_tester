import { PhaserFactory } from './PhaserFactory';
import { Sprite } from '../script4/display/Sprite';

export class DragonBones extends Sprite {

	constructor(game, armatureName) {
		super(game);

		DragonBones.GAME = game;

		var key = armatureName.toLowerCase();

		var skeletonData = this.game.cache.getJSON(key + "Ske");
        var textureData = this.game.cache.getJSON(key);
		var texture = this.game.cache.getImage(key);

        this.factory = new PhaserFactory();
		this.skeleton = this.factory.parseDragonBonesData(skeletonData);
		this.factory.parseTextureAtlasData(textureData, texture);
		this.armature = this.factory.buildArmatureDisplay(armatureName);

		this.refreshClock();

		this.addChild(this.armature);
	}

	refreshClock() {
		var hasEvent = false;
        var callback = PhaserFactory._clockHandler;
        this.game.time.events.events.forEach(function (event, index, array) {
            if (event.callback == callback) {
                hasEvent = true;
                return;
            }
        });
        if (!hasEvent)
            this.game.time.events.loop(20, PhaserFactory._clockHandler, PhaserFactory);
	}

	static get GAME() { return DragonBones._GAME; }
	static set GAME(value) { DragonBones._GAME = value; }


    static hasArmature(value) {
        return DragonBones._armatures.indexOf(value) >= 0;
    }

    
    static addArmature(value) {
        if (value && DragonBones._armatures.indexOf(value) < 0) {
            DragonBones._armatures.push(value);
        }
    }

    static removeArmature(value) {
        if (value) {
            var index = DragonBones._armatures.indexOf(value);
            if (index >= 0) {
                DragonBones._armatures.splice(index, 1);
            }
        }
    }

    static get PI_D() { return Math.PI * 2; }
    static get PI_H() { Math.PI / 2; }
    static get PI_Q() { return Math.PI / 4; }
    static get ANGLE_TO_RADIAN() { return Math.PI / 180; }
    static get RADIAN_TO_ANGLE() { return 180 / Math.PI; }
    static get SECOND_TO_MILLISECOND() { return 1000; }
    static get NO_TWEEN() { return 100; }
    static get VERSION() { return "4.7.2"; }
    
    static get debug() { return (DragonBones._debug) ? DragonBones._debug : false; }
    static set debug(value) { DragonBones._debug = value; }
    
    static get debugDraw() { (DragonBones._debugDraw) ? DragonBones._debugDraw : false; }
    static set debugDraw(value) { DragonBones._debugDraw = value; }
    
    static get _armatures() { return (DragonBones.__armatures) ? DragonBones.__armatures : []; }
    static set _armatures(value) { DragonBones.__armatures = value; }
}

//HACK TO FIX NULL TEXTURE
PIXI.Sprite.prototype.setTexture = function (texture, destroyBase) {
    if (destroyBase !== undefined) {
        this.texture.baseTexture.destroy();
    }
    //  Over-ridden by loadTexture as needed
    this.texture = texture;
    this.texture.baseTexture.skipRender = false;
    this.texture.valid = true;
    this.cachedTint = -1;
};
//HACK TO MAKE BOUNDRY BOX SCALE TO ANIMATION SIZE (if used)
// PIXI.Sprite.prototype.getBounds = function (targetCoordinateSpace) {
//     var isTargetCoordinateSpaceDisplayObject = (targetCoordinateSpace && targetCoordinateSpace instanceof PIXI.DisplayObject);
//     var isTargetCoordinateSpaceThisOrParent = true;
//     if (!isTargetCoordinateSpaceDisplayObject) {
//         targetCoordinateSpace = this;
//     }
//     else if (targetCoordinateSpace instanceof PIXI.DisplayObjectContainer) {
//         isTargetCoordinateSpaceThisOrParent = targetCoordinateSpace.contains(this);
//     }
//     else {
//         isTargetCoordinateSpaceThisOrParent = false;
//     }
//     var i;
//     if (isTargetCoordinateSpaceDisplayObject) {
//         var matrixCache = targetCoordinateSpace.worldTransform;
//         targetCoordinateSpace.worldTransform = PIXI.identityMatrix;
//         for (i = 0; i < targetCoordinateSpace.children.length; i++) {
//             targetCoordinateSpace.children[i].updateTransform();
//         }
//     }
//     var minX = Infinity;
//     var minY = Infinity;
//     var maxX = -Infinity;
//     var maxY = -Infinity;
//     var childBounds;
//     var childMaxX;
//     var childMaxY;
//     var childVisible = false;
//     for (i = 0; i < this.children.length; i++) {
//         var child = this.children[i];
//         if (!child.visible) {
//             continue;
//         }
//         childVisible = true;
//         childBounds = this.children[i].getBounds();
//         minX = (minX < childBounds.x) ? minX : childBounds.x;
//         minY = (minY < childBounds.y) ? minY : childBounds.y;
//         childMaxX = childBounds.width + childBounds.x;
//         childMaxY = childBounds.height + childBounds.y;
//         maxX = (maxX > childMaxX) ? maxX : childMaxX;
//         maxY = (maxY > childMaxY) ? maxY : childMaxY;
//     }
//     var bounds = this._bounds;
//     if (!childVisible) {
//         bounds = new PIXI.Rectangle();
//         var w0 = bounds.x;
//         var w1 = bounds.width + bounds.x;
//         var h0 = bounds.y;
//         var h1 = bounds.height + bounds.y;
//         var worldTransform = this.worldTransform;
//         var a = worldTransform.a;
//         var b = worldTransform.b;
//         var c = worldTransform.c;
//         var d = worldTransform.d;
//         var tx = worldTransform.tx;
//         var ty = worldTransform.ty;
//         var x1 = a * w1 + c * h1 + tx;
//         var y1 = d * h1 + b * w1 + ty;
//         var x2 = a * w0 + c * h1 + tx;
//         var y2 = d * h1 + b * w0 + ty;
//         var x3 = a * w0 + c * h0 + tx;
//         var y3 = d * h0 + b * w0 + ty;
//         var x4 = a * w1 + c * h0 + tx;
//         var y4 = d * h0 + b * w1 + ty;
//         maxX = x1;
//         maxY = y1;
//         minX = x1;
//         minY = y1;
//         minX = x2 < minX ? x2 : minX;
//         minX = x3 < minX ? x3 : minX;
//         minX = x4 < minX ? x4 : minX;
//         minY = y2 < minY ? y2 : minY;
//         minY = y3 < minY ? y3 : minY;
//         minY = y4 < minY ? y4 : minY;
//         maxX = x2 > maxX ? x2 : maxX;
//         maxX = x3 > maxX ? x3 : maxX;
//         maxX = x4 > maxX ? x4 : maxX;
//         maxY = y2 > maxY ? y2 : maxY;
//         maxY = y3 > maxY ? y3 : maxY;
//         maxY = y4 > maxY ? y4 : maxY;
//     }
//     bounds.x = minX;
//     bounds.y = minY;
//     bounds.width = maxX - minX;
//     bounds.height = maxY - minY;
//     if (isTargetCoordinateSpaceDisplayObject) {
//         targetCoordinateSpace.worldTransform = matrixCache;
//         for (i = 0; i < targetCoordinateSpace.children.length; i++) {
//             targetCoordinateSpace.children[i].updateTransform();
//         }
//     }
//     if (!isTargetCoordinateSpaceThisOrParent) {
//         var targetCoordinateSpaceBounds = targetCoordinateSpace.getBounds();
//         bounds.x -= targetCoordinateSpaceBounds.x;
//         bounds.y -= targetCoordinateSpaceBounds.y;
//     }
//     return bounds;
// };
//FIXED WebGL: INVALID_ENUM: activeTexture: texture unit out of range
PIXI.WebGLSpriteBatch = function (game) {

    this.game = game;
    this.vertSize = 5;
    this.size = 2000; // Math.pow(2, 16) /  this.vertSize;
    this.vertexSize = (4 * 2) + (4 * 2) + (4) + (4);
    var numVerts = this.vertexSize * this.size * 4;
    var numIndices = this.size * 540000;//6
    this.vertices = new ArrayBuffer(numVerts);
    this.positions = new Float32Array(this.vertices);
    this.colors = new Uint32Array(this.vertices);
    this.indices = new Uint16Array(numIndices);
    this.lastIndexCount = 0;

    for (var i = 0, j = 0; i < numIndices; i += 6, j += 4) {
        this.indices[i + 0] = j + 0;
        this.indices[i + 1] = j + 1;
        this.indices[i + 2] = j + 2;
        this.indices[i + 3] = j + 0;
        this.indices[i + 4] = j + 2;
        this.indices[i + 5] = j + 3;
    }

    this.drawing = false;
    this.currentBatchSize = 0;
    this.currentBaseTexture = null;
    this.dirty = true;
    this.textures = [];
    this.blendModes = [];
    this.shaders = [];
    this.sprites = [];
    this.defaultShader = null;
};