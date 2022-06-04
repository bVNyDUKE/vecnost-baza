import Head from "next/head";
import NavBar from "../components/NavBar";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>Vecnost - Baza</title>
      </Head>
      <div className="flex h-screen flex-col justify-between">
        <NavBar />
        <main className="mb-auto">{children}</main>
        <Footer />
      </div>
    </>
  );
}
