export class BaseObject {

	constructor() {
		/**
         * @version DragonBones 4.5
         */
        this.hashCode = BaseObject._hashCode++;
	}

	static _returnObject(object) {
        var classType = String(object.constructor);
        var maxCount = BaseObject._maxCountMap[classType] == null ? BaseObject._defaultMaxCount : BaseObject._maxCountMap[classType];
        var pool = BaseObject._poolsMap[classType] = BaseObject._poolsMap[classType] || [];
        if (pool.length < maxCount) {
            if (pool.indexOf(object) < 0) {
                pool.push(object);
            }
            else {
                throw new Error();
            }
        }
    }

    /**
     * @version DragonBones 4.5
     */
    static setMaxCount(objectConstructor, maxCount) {
        if (maxCount < 0 || maxCount != maxCount) {
            maxCount = 0;
        }
        if (objectConstructor) {
            var classType = String(objectConstructor);
            BaseObject._maxCountMap[classType] = maxCount;
            var pool = BaseObject._poolsMap[classType];
            if (pool && pool.length > maxCount) {
                pool.length = maxCount;
            }
        }
        else {
            BaseObject._defaultMaxCount = maxCount;
            for (var classType in BaseObject._poolsMap) {
                if (BaseObject._maxCountMap[classType] == null) {
                    continue;
                }
                BaseObject._maxCountMap[classType] = maxCount;
                var pool = BaseObject._poolsMap[classType];
                if (pool.length > maxCount) {
                    pool.length = maxCount;
                }
            }
        }
    }

    /**
     * @version DragonBones 4.5
     */
    static clearPool(objectConstructor = null) {
        if (objectConstructor) {
            var pool = BaseObject._poolsMap[String(objectConstructor)];
            if (pool && pool.length) {
                pool.length = 0;
            }
        }
        else {
            for (var iP in BaseObject._poolsMap) {
                var pool = BaseObject._poolsMap[iP];
                pool.length = 0;
            }
        }
    }

    /**
     * @version DragonBones 4.5
     */
    static borrowObject(objectConstructor) {
        var pool = BaseObject._poolsMap[String(objectConstructor)];
        if (pool && pool.length) {
            return pool.pop();
        }
        else {
            var object = new objectConstructor();
            object._onClear();
            return object;
        }
    }

    /**
     * @version DragonBones 4.5
     */
    returnToPool() {
        this._onClear();
        BaseObject._returnObject(this);
    }

    static get _hashCode() { return (BaseObject.__hashCode) ? BaseObject.__hashCode : 0; }
    static set _hashCode(value) { BaseObject.__hashCode = value; }

    static get _defaultMaxCount() { return (BaseObject.__defaultMaxCount) ? BaseObject.__defaultMaxCount : 5000; }
    static set _defaultMaxCount(value) { BaseObject.__defaultMaxCount = value; }

    static get _maxCountMap() { return (BaseObject.__maxCountMap) ? BaseObject.__maxCountMap : {}; }
    static set _maxCountMap(value) { BaseObject.__maxCountMap = value; }

 	static get _poolsMap() { return (BaseObject.__poolsMap) ? BaseObject.__poolsMap : {}; }
 	static set _poolsMap(value) { BaseObject.__poolsMap = value; }

}