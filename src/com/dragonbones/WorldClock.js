import { DragonBones } from './DragonBones';
import { Armature } from './Armature';

export class WorldClock {

	constructor() {
		/**
         * @version DragonBones 3.0
         */
        this.time = new Date().getTime() / DragonBones.SECOND_TO_MILLISECOND;
        /**
         * @version DragonBones 3.0
         */
        this.timeScale = 1;
        this._animatebles = [];
	}

	get clock() {
		if (!WorldClock._clock) {
            WorldClock._clock = new WorldClock();
        }
        return WorldClock._clock;
	}

    /**
     * @version DragonBones 3.0
     */
    advanceTime(passedTime) {
        if (passedTime != passedTime) {
            passedTime = 0;
        }
        if (passedTime < 0) {
            passedTime = new Date().getTime() / DragonBones.SECOND_TO_MILLISECOND - this.time;
        }
        passedTime *= this.timeScale;
        if (passedTime < 0) {
            this.time -= passedTime;
        }
        else {
            this.time += passedTime;
        }
        if (passedTime) {
            var i = 0, r = 0, l = this._animatebles.length;
            for (; i < l; ++i) {
                var animateble = this._animatebles[i];
                if (animateble) {
                    if (r > 0) {
                        this._animatebles[i - r] = animateble;
                        this._animatebles[i] = null;
                    }
                    animateble.advanceTime(passedTime);
                }
                else {
                    r++;
                }
            }
            if (r > 0) {
                l = this._animatebles.length;
                for (; i < l; ++i) {
                    var animateble = this._animatebles[i];
                    if (animateble) {
                        this._animatebles[i - r] = animateble;
                    }
                    else {
                        r++;
                    }
                }
                this._animatebles.length -= r;
            }
        }
    }

    /**
     * @version DragonBones 3.0
     */
    contains(value) {
        return this._animatebles.indexOf(value) >= 0;
    }

    /**
     * @version DragonBones 3.0
     */
    add(value) {
        if (value && this._animatebles.indexOf(value) < 0) {
            this._animatebles.push(value);
            if (DragonBones.debug && value instanceof Armature) {
                DragonBones.addArmature(value);
            }
        }
    }

    /**
     * @version DragonBones 3.0
     */
    remove(value) {
        var index = this._animatebles.indexOf(value);
        if (index >= 0) {
            this._animatebles[index] = null;
            if (DragonBones.debug && value instanceof Armature) {
                DragonBones.removeArmature(value);
            }
        }
    }

    /**
     * @version DragonBones 3.0
     */
    clear() {
        for (var i = 0, l = this._animatebles.length; i < l; ++i) {
            this._animatebles[i] = null;
        }
    };

    static get _clock() { return WorldClock.__clock; }
    static set _clock(value) { WorldClock.__clock = _value; }

}