import { BaseObject } from './BaseObject';
import { Transform } from './Transform';
import { Matrix } from './Matrix';

export class TransformObject extends BaseObject {

	constructor() {
		super();

		/**
         * @version DragonBones 3.0
         */
        this.global = new Transform();

        /**
         * @version DragonBones 3.0
         */
        this.origin = new Transform();

        /**
         * @version DragonBones 3.0
         */
        this.offset = new Transform();
        this._globalTransformMatrix = new Matrix();
	}

	_onClear() {
        this.userData = null;
        this.name = null;
        this.globalTransformMatrix = this._globalTransformMatrix;
        this.global.identity();
        this.origin.identity();
        this.offset.identity();
        this._armature = null;
        this._parent = null;
        this._globalTransformMatrix.identity();
    }

    _setArmature(value) {
        this._armature = value;
    }

    _setParent(value) {
        this._parent = value;
    }

    get armature() {
    	return this._armature;
    }

    get parent() {
    	return this._parent;
    }

}