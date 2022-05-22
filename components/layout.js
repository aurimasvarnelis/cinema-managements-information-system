import Head from "next/head";
import Header from "./header";
import Link from "next/link";
import { useRouter } from "next/router";

//import Footer from "./footer"

export default function Layout({ children }) {
	return (
		<>
			<Head>
				<title>CMIS</title>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</Head>
			<Header />
			{/* <Sidebar /> */}
			<main>{children}</main>
			{/* <Footer /> */}
		</>
	);
}
