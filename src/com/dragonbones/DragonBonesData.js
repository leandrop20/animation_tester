import { BaseObject } from './BaseObject';

export class DragonBonesData extends BaseObject {

	constructor() {
		super();

		/**
         * @version DragonBones 3.0
         */
        this.armatures = {};
        this._armatureNames = [];
	}

	static toString() {
        return "[class DragonBonesData]";
    }

    _onClear() {
        for (var i in this.armatures) {
            this.armatures[i].returnToPool();
            delete this.armatures[i];
        }
        this.autoSearch = false;
        this.frameRate = 0;
        this.name = null;
        this._armatureNames.length = 0;
    }

    /**
     * @version DragonBones 3.0
     */
    getArmature(name) {
        return this.armatures[name];
    }

    addArmature(value) {
        if (value && value.name && !this.armatures[value.name]) {
            this.armatures[value.name] = value;
            this._armatureNames.push(value.name);
            value.parent = this;
        }
        else {
            throw new Error();
        }
    }

    get armatureNames() {
    	return this._armatureNames;
    }

    /**
     * @deprecated
     * @see dragonBones.BaseFactory#removeDragonBonesData()
     */
    dispose() {
        this.returnToPool();
    }

}