import "../styles/globals.css";
import "../styles/globals.scss";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/scss/bootstrap.scss";
import "react-datepicker/dist/react-datepicker.css";

import {
	RecoilRoot,
	atom,
	selector,
	useRecoilState,
	useRecoilValue,
} from "recoil";
import { checkCookies, setCookies } from "cookies-next";

import Head from "next/head";
import Layout from "../components/layout";
import React from "react";
import { SessionProvider } from "next-auth/react";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
	if (!checkCookies("cinema")) setCookies("cinema", "based");
	return (
		<SessionProvider session={session}>
			<RecoilRoot>
				<Layout>
					<Component {...pageProps} />
				</Layout>
			</RecoilRoot>
		</SessionProvider>
	);
}

export default MyApp;
