import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/router";
import { RegionData, SearchResult } from "../types";
import Paginator from "../components/Search/Paginator";
import ResultList from "../components/Search/ResultList";
import SearchBar from "../components/Search/SearchBar";

export async function getStaticProps() {
  const { data } = await supabase.rpc<RegionData>("region_data");
  return { props: { options: data }, revalidate: 60 * 60 * 24 };
}

export default function Search({ options }: { options: RegionData[] }) {
  const [results, setResults] = useState<null | SearchResult[]>(null);
  const [searching, setSearching] = useState(false);
  const [count, setCount] = useState<number | null>(0);

  const router = useRouter();
  const {
    query: { ime, okrug, opstina, groblje },
  } = router;
  const page = parseInt(router.query.page as string) || 1;

  useEffect(() => {
    const rangeFrom = (page - 1) * 10 || 0;
    const rangeTo = page * 10 || 10;
    let query = supabase
      .from("persons")
      .select(
        "id, ime, prezime, rodjenje, smrt, groblje!inner(id, name, opstina!inner(id, name, okrug!inner(id,name)))",
        {
          count: "exact",
        }
      )
      .limit(10)
      .range(rangeFrom, rangeTo);

    if (ime && typeof ime === "string" && ime !== "all") {
      query = query.textSearch("fts", ime as string, {
        config: "sr",
        type: "websearch",
      });
    }

    if (groblje) {
      query = query.eq("groblje.id", groblje);
    }
    if (opstina) {
      query = query.eq("groblje.opstina.id", opstina);
    }
    if (okrug) {
      query = query.eq("groblje.opstina.okrug.id", okrug);
    }

    async function search() {
      setSearching(true);
      const { data, count } = await query;
      setResults(data as SearchResult[]);
      setCount(count);
      setSearching(false);
    }

    if (ime !== undefined && ime !== "") {
      search();
    }
  }, [ime, page, groblje, opstina, okrug]);

  const handlePageChange = (page: number) => {
    router.push(
      {
        pathname: "/pretraga",
        query: { ...router.query, page: page },
      },
      "",
      { shallow: true, scroll: true }
    );
  };

  return (
    <div className="container mx-auto max-w-3xl">
      <SearchBar searching={searching} options={options} router={router} />

      <div className="relative my-5 flex justify-center">
        {results && <ResultList results={results} />}
      </div>

      {results && count !== null && count > 10 && (
        <Paginator
          count={count || 0}
          page={+page || 1}
          perPage={10}
          handlePageChange={handlePageChange}
        />
      )}
    </div>
  );
}
