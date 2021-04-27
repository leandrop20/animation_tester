import { BaseObject } from './BaseObject';
import { Rectangle } from './Rectangle';

export class ArmatureData extends BaseObject {

	constructor() {
		super();

		this.aabb = new Rectangle();

        /**
         * @version DragonBones 3.0
         */
        this.bones = {};

        /**
         * @version DragonBones 3.0
         */
        this.slots = {};

        /**
         * @version DragonBones 3.0
         */
        this.skins = {};

        /**
         * @version DragonBones 3.0
         */
        this.animations = {};

        this.actions = [];
        this._sortedBones = [];
        this._sortedSlots = [];
        this._bonesChildren = {};
	}

	static _onSortSlots(a, b) {
        return a.zOrder > b.zOrder ? 1 : -1;
    }

    
    static toString() {
        return "[class ArmatureData]";
    }

    _onClear() {
        for (var i in this.bones) {
            this.bones[i].returnToPool();
            delete this.bones[i];
        }
        for (var i in this.slots) {
            this.slots[i].returnToPool();
            delete this.slots[i];
        }
        for (var i in this.skins) {
            this.skins[i].returnToPool();
            delete this.skins[i];
        }
        for (var i in this.animations) {
            this.animations[i].returnToPool();
            delete this.animations[i];
        }
        for (var i = 0, l = this.actions.length; i < l; ++i) {
            this.actions[i].returnToPool();
        }
        this.frameRate = 0;
        this.type = 0 /* Armature */;
        this.name = null;
        this.parent = null;
        this.userData = null;
        this.aabb.clear();
        this.actions.length = 0;
        this.cacheFrameRate = 0;
        this.scale = 1;
        for (var i in this._bonesChildren) {
            delete this._bonesChildren[i];
        }
        this._boneDirty = false;
        this._slotDirty = false;
        this._defaultSkin = null;
        this._defaultAnimation = null;
        this._sortedBones.length = 0;
        this._sortedSlots.length = 0;
    }

    _sortBones() {
        var total = this._sortedBones.length;
        if (total < 1) {
            return;
        }
        var sortHelper = this._sortedBones.concat();
        var index = 0;
        var count = 0;
        this._sortedBones.length = 0;
        while (count < total) {
            var bone = sortHelper[index++];
            if (index >= total) {
                index = 0;
            }
            if (this._sortedBones.indexOf(bone) >= 0) {
                continue;
            }
            if (bone.parent && this._sortedBones.indexOf(bone.parent) < 0) {
                continue;
            }
            if (bone.ik && this._sortedBones.indexOf(bone.ik) < 0) {
                continue;
            }
            if (bone.ik && bone.chain > 0 && bone.chainIndex == bone.chain) {
                this._sortedBones.splice(this._sortedBones.indexOf(bone.parent) + 1, 0, bone);
            }
            else {
                this._sortedBones.push(bone);
            }
            count++;
        }
    }

    _sortSlots() {
        this._sortedSlots.sort(ArmatureData._onSortSlots);
    }
    
    cacheFrames(value) {
        if (this.cacheFrameRate == value) {
            return;
        }
        this.cacheFrameRate = value;
        var frameScale = this.cacheFrameRate / this.frameRate;
        for (var i in this.animations) {
            this.animations[i].cacheFrames(frameScale);
        }
    }

    addBone(value, parentName) {
        if (value && value.name && !this.bones[value.name]) {
            if (parentName) {
                var parent_1 = this.getBone(parentName);
                if (parent_1) {
                    value.parent = parent_1;
                }
                else {
                    (this._bonesChildren[parentName] = this._bonesChildren[parentName] || []).push(value);
                }
            }
            var children = this._bonesChildren[value.name];
            if (children) {
                for (var i = 0, l = children.length; i < l; ++i) {
                    children[i].parent = value;
                }
                delete this._bonesChildren[value.name];
            }
            this.bones[value.name] = value;
            this._sortedBones.push(value);
            this._boneDirty = true;
        }
        else {
            throw new Error();
        }
    }

    addSlot(value) {
        if (value && value.name && !this.slots[value.name]) {
            this.slots[value.name] = value;
            this._sortedSlots.push(value);
            this._slotDirty = true;
        }
        else {
            throw new Error();
        }
    }

	addSkin(value) {
        if (value && value.name && !this.skins[value.name]) {
            this.skins[value.name] = value;
            if (!this._defaultSkin) {
                this._defaultSkin = value;
            }
        }
        else {
            throw new Error();
        }
    }

    addAnimation(value) {
        if (value && value.name && !this.animations[value.name]) {
            this.animations[value.name] = value;
            if (!this._defaultAnimation) {
                this._defaultAnimation = value;
            }
        }
        else {
            throw new Error();
        }
    }

    /**
     * @version DragonBones 3.0
     */
    getBone(name) {
        return this.bones[name];
    }

    /**
     * @version DragonBones 3.0
     */
    getSlot(name) {
        return this.slots[name];
    }

    /**
     * @version DragonBones 3.0
     */
    getSkin(name) {
        return name ? this.skins[name] : this._defaultSkin;
    }

    /**
     * @version DragonBones 3.0
     */
    getAnimation(name) {
        return name ? this.animations[name] : this._defaultAnimation;
    };

    get sortedBones() {
    	if (this._boneDirty) {
            this._boneDirty = false;
            this._sortBones();
        }
        return this._sortedBones;
    }

    get sortedSlots() {
    	if (this._slotDirty) {
            this._slotDirty = false;
            this._sortSlots();
        }
        return this._sortedSlots;
    }

    get defaultSkin() {
    	return this._defaultSkin;
    }

    get defaultAnimation() {
    	return this._defaultAnimation;
    }

}