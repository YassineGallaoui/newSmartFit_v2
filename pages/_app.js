import React, { useEffect } from "react"
import Header from "../components/Header/index"
import Navbar from "../components/Navbar/index"
import "bootstrap/dist/css/bootstrap.min.css"; // Import bootstrap CSS
import "../styles/globals.css"

function MyApp({ Component, pageProps }) {
  
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle").then((bootstrap) => {
      // Use Bootstrap JS components
      // For example, you can initialize tooltips or other Bootstrap components here
    });
  }, []);
  
  return  (
    <>
      <noscript>You need to enable JavaScript to run this app.</noscript>
      <Header></Header>
      <Navbar></Navbar>
      <Component {...pageProps} />
      <footer>
        newSmartFit
      </footer>
    </>
  )
}

export default MyApp
