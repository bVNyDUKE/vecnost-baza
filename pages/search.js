import SearchBar from "../components/SearchBar";
import ResultList from "../components/ResultList";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  withPageAuth,
  supabaseClient,
} from "@supabase/supabase-auth-helpers/nextjs";

export const getServerSideProps = withPageAuth({ redirectTo: "/login" });

export default function Search() {
  const [results, setResults] = useState(null);
  const {
    query: { ime },
  } = useRouter();

  useEffect(() => {
    async function search() {
      const { data } = await supabaseClient
        .from("persons")
        .select("id, ime, prezime, rodjenje, smrt, groblje (name)")
        .textSearch("fts", ime, { config: "sr", type: "websearch" });
      setResults(data);
    }

    if (ime !== undefined) {
      search();
    }
  }, [ime]);

  return (
    <>
      <div className="container mx-auto px-5">
        <SearchBar />
      </div>
      <div className="mt-5 flex justify-start">
        <ResultList results={results} />
      </div>
    </>
  );
}
