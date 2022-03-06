import '../styles/globals.css'
import '../styles/globals.scss'
import Head from "next/head";
import { SessionProvider } from "next-auth/react"
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/scss/bootstrap.scss'

function MyApp({Component, pageProps: { session, ...pageProps },}) {
  return(
    <>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </>   
  ) 
}

export default MyApp
