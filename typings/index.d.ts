declare module 'blu-store' {
	export = Store;

	class Store<K, V> extends Map<K, V> {
		public array(): V[];
		public clone(): Store<K, V>;
		public concat(...stores: Store<K, V>[]): Store<K, V>;
		public filter(func: (value: V, key: K, index: number, store: this) => boolean, bind?: any): Store<K, V>;
		public first(): V;
		public firstKey(): K;
		public indexOf(key: K, fromIndex?: number): number;
		public keyArray(): K[];
		public last(): V;
		public lastKey(): K;
		public lastIndexOf(key: K, fromIndex?: number): number;
		public map<T>(callback: (value: V, key: K, index: number, store: this) => T, thisArg?: any): T[];
		public random(): V;
		public randomKey(): K;
		public randomPair(): [K, V];
		public split(callback: (value: V, key: K, index: number, store: this) => boolean, thisArg?: any): [Store<K, V>, Store<K, V>];

		/** **DEPRECATED** */
		public flat(strength?: number): Store<K, V>;
		/** **DEPRECATED** */
		public flatMap(func: () => any[], bind: any): Store<K, V>;
	}
}