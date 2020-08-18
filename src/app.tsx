import * as React from "react";
import { createUseStyles } from "react-jss";
import { styles } from "./styles";
import { Layout } from "./components/layout";

const useStyles = createUseStyles(styles);

export const App: React.FC = () => {
	const classes = useStyles();

	return <Layout />;
};
