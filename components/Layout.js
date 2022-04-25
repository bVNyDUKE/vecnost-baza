import Head from "next/head";
import NavBar from "../components/NavBar";

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>Vecnost - Baza</title>
      </Head>
      <NavBar />
      <main>{children}</main>
    </>
  );
}