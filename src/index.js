const util = require('util'); // eslint-disable-line no-unused-vars

/**
 * A storage class that includes additional methods.
 * @class
 * @extends {Map}
 */
class Store extends Map {
	constructor(iterable) {
		super(iterable);
	}
    /**
     * Returns all the values of the Store in an array.
     * @returns {Array} The array of the Store's values.
     */
	array() {
		return [...this.values()];
	}

    /**
     * Returns a copy of the Store.
     * @returns {Store}
     */
	clone() {
		return new Store(this);
	}

    /**
     * Clones the store and merges with other stores if supplied.
     * @param {...Store} [stores] The stores to concat/merge with the Store.
     * @returns {Store} A cloned Store with other merged Stores.
     * @example Client.bots.concat(Client.emojis, Client.guilds); // Why?
     */
	concat(...stores) {
		const store = this.clone();
		for (const [[key, value]] of stores) store.set(key, value);
		return store;
	}

    /**
     * Filters the store using a passed function, and
     * returns a new Store including the filtered values.
     *
     * @param {Function} callback The provided function to test against the Store.
     * @param {*} [bind] The variable to bind the callback's `this` value.
     * @returns {Store} The new Store containing the filtered contents.
     * @example
     * getBots()
     *     .then(bots => {
     *         const onlyApproved = bots.filter(bot => bot.approved);
     *         console.log(`${onlyApproved.size} bots are approved.`);
     *     })
     *     .catch(console.error);
     */
	filter(callback, thisArg) {
		if (typeof callback !== 'function') throw new TypeError('callback must be a function.');
		if (typeof thisArg !== 'undefined') callback = callback.bind(thisArg);

		const filtered = new Store();
		let index = 0;
		for (const [key, value] of this) {
			if (callback(value, key, index++, this)) filtered.set(key, value);
		}

		return filtered;
	}

    /**
     * Checks and returns a given key's index in the Store.
     * Identical to
     * [Array.indexOf()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf)
     * @param {K} key The key to retrieve its index from the Store.
     * @param {number} [fromIndex=0] The index to start from.
     * @returns {number} The key's index; -1 if not found.
     */
	indexOf(key, fromIndex = 0) {
        if (this.size === 0) return -1;
		return this.keyArray().indexOf(key, fromIndex);
	}

    /**
     * Returns all the keys of the Store in an array.
     * @returns {Array} An array of the Store's keys.
     */
	keyArray() {
		return [...this.keys()];
	}

    /**
     * Checks and returns a given key's index in the Store,
     * searching __backwords__. Identical to
     * [Array.lastIndexOf()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/lastIndexOf)
     * @param {K} key The key to retrieve its index from the Store.
     * @param {number} [fromIndex=this.size - 1] The index to start from.
     * @returns {number} The key's index; -1 if not found.
     */
	lastIndexOf(key, fromIndex = this.size - 1) {
        if (this.size === 0) return -1;
		return this.keyArray().lastIndexOf(key, fromIndex);
	}

    /**
     * Maps each and every value in the Store, and returns
     * an array containing the new values.
     *
     * @param {Function} callback The function to run for each value and key in the Store.
     * @param {*} [thisArg] The variable to bind the callback's `this` value.
     * @returns {Array} The mapped values.
     */
	map(callback, thisArg) {
		if (typeof callback !== 'function') throw new TypeError('callback must be a function');
		if (typeof thisArg !== 'undefined') callback = callback.bind(thisArg);

		const arr = [];
		let index = 0;
		for (const [key, value] of this) {
			arr.push(callback(value, key, index++, this));
		}
		return arr;
    }

    /**
     * The first value of the Store.
     * @type {*}
     */
    first() {
        return this.array()[0];
    }

    /**
     * The first key of the Store.
     * @type {*}
     */
    firstKey() {
        return this.keyArray()[0];
    }

    /**
     * Flattens out the array values of the Store,
     * and returns a new Store with the flattened
     * values.
     *
     * @deprecated
     * @param {number} [strength=1] The strength to flatten out the values. Supports Infinity.
     * @returns {Store} The flattened Store.
     * @example
     * const store = new Store().set('hec', [1, 2, [3, 4, [5, 6]]]);
     * E.flat(1); // [1, 2, 3, 4, [5, 6]];
     * E.flat(2); // [1, 2, 3, 4, 5, 6]
     */
    flat(strength = 1) {
        if (strength < 1) throw new RangeError('strength must be greater than 1.');
        const toFlat = this.clone();
        if (!this.array().some(v => Array.isArray(v))) return toFlat;

        if (Array.prototype.flat) {
            const mapped = toFlat.map((value, key) => [key, Array.isArray(value) ? value.flat(strength) : value]);
            for (const [key, value] of mapped) toFlat.set(key, value);
        } else {
            for (let i = strength; i > 0; i--) {
                if (!toFlat.array().some(val => Array.isArray(val) ? val.some(v => Array.isArray(v)) : false)) i = 0;
                for (const [key, value] of toFlat) {
                    if (Array.isArray(value)) toFlat.set(key, [].concat(...value));
                }
            }
        }

        return toFlat;
    }

    /**
     * Maps throughout the store, then flattens out
     * each value by a strength of 1.
     *
     * @deprecated
     * @param {Function} callback The function to pass to map.
     * @param {*} [thisArg] The value to bind the callback's `this` value
     * @returns {Store} A store containing the mapped contents.
     */
    flatMap(callback, bind) {
        if (typeof callback !== 'function') throw new TypeError('callback must be a Function.');
        if (typeof bind !== 'undefined') callback = callback.bind(bind);
        const toFlat = this.clone();

        if (!this.array().some(v => Array.isArray(v))) return toFlat;
        if (Array.prototype.flatMap) {
            const mapped = toFlat.map((value, key) => [key, Array.isArray(value) ? value.flatMap(callback, bind) : value]);
            for (const [key, value] of mapped) toFlat.set(key, value);
        } else {
            const mapped = toFlat.map((value, key) => [key, Array.isArray(value) ? [].concat(callback(value, bind)) : value]);
            for (const [key, value] of mapped) toFlat.set(key, value);
        }
        return toFlat;
    }

    /**
     * The last value of the Store.
     * @type {*}
     */
    last() {
        return this.array()[this.size - 1];
    }

    /**
     * The last value of the Store.
     * @type {*}
     */
    lastKey() {
        return this.keyArray()[this.size - 1];
    }

    /**
     * Retrives a random value of the Store.
     * @returns {*} A random value.
     */
	random() {
		const values = this.array();
		return values[Math.floor(Math.random() * values.length)];
	}

    /**
     * Retrieves a random key of the Store.
     * @returns {*} A random key.
     */
	randomKey() {
		const keys = this.keyArray();
		return keys[Math.floor(Math.random() * keys.length)];
	}

    /**
     * Retrieves a random key-value pair of the Store and
     * returns a new Array
     * @returns {Array} A random pair.
     */
	randomPair() {
		const key = this.randomKey();
		const pair = [];

		pair.push(key, this.get(key));
		return pair;
	}

    /**
     * Splits the Store into two stores based on a function that
     * testifies each pair in the Store, those that pass to the
     * first Store and those that fail in the second Store.
     * @param {Function} callback The function passed to testify.
     * @param {*} [thisArg] The value to bind the callback's `this` value.
     * @returns {Store[]}
     * @example
     * const [approvedBots, unapprovedBots] = Client.bots.split(bot => bot.isApproved);
     * console.log(`The total of approved bots are ${approvedBots.size}, with ${unapprovedBots.size} being unapproved!`)
     */
	split(callback, thisArg) {
		if (typeof callback !== 'function') throw new TypeError('callback must be a Function.');
		if (typeof thisArg !== 'undefined') callback = callback.bind(thisArg);

		const [first, second] = [new Store(), new Store()];
		let index = 0;
		for (const [key, value] of this) {
			if (callback(value, key, index++, this)) {
				first.set(key, value);
			} else {
				second.set(key, value);
			}
		}
		return [first, second];
	}
}

Store.prototype.flat = util.deprecate(Store.prototype.flat, 'Will be removed in a future release');
Store.prototype.flatMap = util.deprecate(Store.prototype.flatMap, 'Will be removed in a future release');

module.exports = Store;