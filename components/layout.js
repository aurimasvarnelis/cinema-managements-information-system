import Header from "./header"
//import Footer from "./footer"
import Head from "next/head";

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Header />
      <main>{children}</main>
      {/* <Footer /> */}
    </>
  )
}
