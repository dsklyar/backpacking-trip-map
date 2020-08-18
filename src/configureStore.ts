import { applyMiddleware, compose, createStore, StoreEnhancer } from "redux";
import { createRootReducer, DEFAULT_ROOT_STATE } from "./reducers";
import { composeWithDevTools, EnhancerOptions } from "redux-devtools-extension";

export const configureStore = () => {
	const enhanceWithDevTools = composeWithDevTools({ trace: true });
	const storeEnhancer: StoreEnhancer = enhanceWithDevTools();
	const store = createStore(createRootReducer(), DEFAULT_ROOT_STATE, storeEnhancer);

	return store;
};
