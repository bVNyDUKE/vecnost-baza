import Head from "next/head";
import NavBar from "../components/NavBar";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>Vecnost - Baza</title>
      </Head>
      <main className="h-screen">
        <NavBar />
        {children}
      </main>
      <Footer />
    </>
  );
}
