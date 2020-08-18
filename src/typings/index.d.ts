declare module "*.svg" {
	const value: any;
	export = value;
}

declare module "*.png" {
	const value: any;
	export = value;
}

declare type Nothing = void | null;
declare type Maybe<T> = T | Nothing;
declare interface IAction {
	type: string;
	payload?: any;
	meta?: any;
}
