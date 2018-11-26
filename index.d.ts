declare module '@ired_me/red-store' {
	export = Store;

	class Store<K, V> extends Map<K, V> {
		public array(): V[];
		public clone(): Store<K, V>;
		public concat(...stores: Store<K, V>[]): Store<K, V>;
		public filter(func: (v: V, k: K, s: Store<K, V>) => boolean, bind?: any): Store<K, V>;
		public indexOf(key: K, fromIndex?: number): number;
		public keyArray(): K[];
		public lastIndexOf(key: K, fromIndex?: number): number;
		public map<T>(func: (v: V, k: K, s: Store<K, V>) => T, bind?: any): T[];
		public random(): V;
		public randomKey(): K;
		public randomPair(): (K | V)[];
		public split(func: (v: V, k: K, s: Store<K, V>) => boolean, bind?: any): [Store<K, V>, Store<K, V>];
	}
}