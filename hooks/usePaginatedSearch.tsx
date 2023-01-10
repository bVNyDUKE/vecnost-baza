import { SearchResult } from "../types";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";

export const usePaginatedSearch = () => {
  const [results, setResults] = useState<null | SearchResult[]>(null);
  const [searching, setSearching] = useState(false);
  const [count, setCount] = useState<number | null>(0);

  const router = useRouter();
  const {
    query: { ime, okrug, opstina, groblje },
  } = router;
  const page = router.query.page ? +router.query.page : 1;

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

  const handlePageChange = useCallback(
    (page: number) => {
      router.push(
        {
          pathname: "/pretraga",
          query: { ...router.query, page: page },
        },
        "",
        { shallow: true, scroll: true }
      );
    },
    [router]
  );

  return {
    results,
    count,
    searching,
    handlePageChange,
  };
};
