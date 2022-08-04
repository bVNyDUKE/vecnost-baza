import Head from "next/head";
import NavBar from "./NavBar";
import Footer from "./Footer";
import React from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Head>
        <title>Vecnost - Baza</title>
      </Head>
      <NavBar />
      <main className="min-h-screen antialiased">{children}</main>
      <Footer />
    </>
  );
}
