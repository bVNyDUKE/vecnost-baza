import SearchBar from "../components/SearchBar";
import ResultList from "../components/ResultList";
import { useRouter } from "next/router";
import { supabase } from "../utils/supabaseClient";
import { useEffect, useState } from "react";

export default function Search() {
  const [results, setResults] = useState(null);
  const {
    query: { ime },
  } = useRouter();

  useEffect(() => {
    const search = async () => {
      const { data } = await supabase
        .from("persons")
        .select("id, ime, prezime, rodjenje, smrt, groblje (name)")
        .textSearch("fts", ime, { config: "sr", type: "websearch" });
      setResults(data);
    };
    search();
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
