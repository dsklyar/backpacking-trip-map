import * as React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./app";
import { configureStore } from "./configureStore";
import { Store } from "redux";
import { IStoreState } from "./reducers";
import { Provider } from "react-redux";

const store: Store<IStoreState, IAction> = configureStore();

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById("app"),
);
