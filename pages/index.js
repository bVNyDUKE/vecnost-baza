import Head from "next/head";
import { useState } from "react";
import SearchBar from "../components/SearchBar";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const [results, setResults] = useState(null);
  return (
    <div>
      <Head>
        <title>Vecnost - Baza</title>
      </Head>

      <main>
        <div className="flex justify-center items-center mt-5">
          <Image
            src="/vecna-logo-solo-100.png"
            alt="Vecnost logo"
            width={90}
            height={100}
          />
          <SearchBar setResults={setResults} />
        </div>
        <div className="flex justify-start mt-5">
          <div className="w-72 min-h-screen font-serif font-bold text-8xl mr-5 bg-slate-400 relative">
            <div className="transform -rotate-90 origin-center absolute top-32">
              Arhiva
            </div>
          </div>
          {results !== null && results.length === 0 && (
            <div>Nema rezultata za ovu pretragu</div>
          )}
          {results !== null && results.length > 0 && (
            <div className="grid grid-cols-4 gap-8">
              {results.map((result) => (
                <Link
                  passHref
                  key={result.id}
                  href={{ pathname: "/entries/[id]", query: { id: result.id } }}
                >
                  <ul className="mb-5 border border-gray-300 p-2 w-32 h-44 shadow-md hover:cursor-pointer hover:shadow-xl">
                    <li>
                      Ime: {result.ime} {result.prezime}
                    </li>
                    <li>Rodjenje: {result.rodjenje}</li>
                    <li>Smrt: {result.smrt}</li>
                    <li>Groblje: {result.groblje}</li>
                  </ul>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
