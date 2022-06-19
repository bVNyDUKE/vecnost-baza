import Head from "next/head";
import NavBar from "./NavBar";
import Footer from "./Footer";
import React from "react";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Head>
        <title>Vecnost - Baza</title>
      </Head>
      <div className="flex min-h-screen flex-col justify-between">
        <NavBar />
        <main className="mb-auto">{children}</main>
      </div>
      <Footer />
    </>
  );
};
