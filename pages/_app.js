import "../styles/globals.css";
import "../styles/globals.scss";
import Head from "next/head";
import { SessionProvider } from "next-auth/react";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/scss/bootstrap.scss";
import { setCookies, checkCookies } from "cookies-next";
import React from "react";
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from "recoil";
import Layout from "../components/layout";

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
