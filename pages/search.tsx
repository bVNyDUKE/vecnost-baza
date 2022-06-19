import { SearchBar } from "../components/Search/SearchBar/SearchBar";
import { ResultList } from "../components/Search/Results/ResultList";
import { Paginator } from "../components/Search/Results/Paginator";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  withPageAuth,
  supabaseClient,
} from "@supabase/supabase-auth-helpers/nextjs";
import { useUser } from "@supabase/supabase-auth-helpers/react";

export type SearchResult = {
  id: string;
  ime: string;
  prezime: string;
  rodjenje: string;
  smrt: string;
  groblje: {
    id: string;
    name: string;
    opstina: {
      id: string;
      name: string;
      okrug: {
        id: string;
        name: string;
      };
    };
  };
};

export const getServerSideProps = withPageAuth({ redirectTo: "/login" });

export default function Search() {
  const { user } = useUser();
  const [results, setResults] = useState<null | SearchResult[]>(null);
  const [searching, setSearching] = useState(false);
  const [count, setCount] = useState<number | null>(0);
  const router = useRouter();
  const {
    query: { ime, okrug, opstina, groblje },
  } = router;
  const page = parseInt(router.query.page as string) || 1;

  useEffect(() => {
    const rangeFrom = page - 1 * 10 || 0;
    const rangeTo = page * 10 || 10;
    let query = supabaseClient
      .from("persons")
      .select(
        "id, ime, prezime, rodjenje, smrt, groblje!inner(id, name, opstina!inner(id, name, okrug!inner(id,name)))",
        {
          count: "exact",
        }
      )
      .limit(10)
      .range(rangeFrom, rangeTo)
      .textSearch("fts", ime as string, {
        config: "sr",
        type: "websearch",
      });

    if (groblje) {
      query = query.eq("groblje.id", groblje);
    }
    if (opstina) {
      query = query.eq("groblje.opstina.id", opstina);
    }

    async function search() {
      setSearching(true);
      const { data, count } = await query;
      setResults(data as SearchResult[]);
      setCount(count);
      setSearching(false);
    }

    if (user && ime !== undefined && ime !== "") {
      search();
    }
  }, [ime, page, user, groblje, opstina, okrug]);

  const handlePageChange = (page: number) => {
    router.push({
      pathname: "/search",
      query: { ...router.query, page: page },
    });
  };

  return (
    <div className="container mx-auto">
      <div className="px-5">
        <SearchBar searching={searching} user={user} />
      </div>
      <div className="my-5 flex justify-center">
        <ResultList results={results} />
      </div>
      {results && results.length > 10 && (
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
