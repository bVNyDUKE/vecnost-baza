import SearchBar from "../components/SearchBar";
import ResultList from "../components/ResultList";
import { useRouter } from "next/router";
import { useEffect, useState, useCallback, useMemo } from "react";
import {
  withPageAuth,
  supabaseClient,
} from "@supabase/supabase-auth-helpers/nextjs";
import { useUser } from "@supabase/supabase-auth-helpers/react";

export const getServerSideProps = withPageAuth({ redirectTo: "/login" });

const Paginator = ({ count, perPage }) => {
  const router = useRouter();
  const page = useMemo(
    () => parseInt(router.query.page) || 1,
    [router.query.page]
  );
  const pages = useMemo(() => Math.ceil(count / perPage), [count, perPage]);

  const handlePageChange = useCallback(
    (page) => {
      router.push({
        pathname: "/search",
        query: { ...router.query, page: page },
      });
    },
    [router]
  );

  return (
    <div className="mb-5 flex justify-center">
      <div className="flex justify-between">
        <button
          className="flex items-center justify-center px-4  py-2 text-sm font-medium hover:shadow-md disabled:text-gray-300 disabled:hover:shadow-none"
          onClick={() => handlePageChange(1)}
          disabled={page === 1}
        >
          &lt;&lt;
        </button>
        <button
          className="flex items-center justify-center  px-4 py-2 text-sm font-medium hover:shadow-md disabled:text-gray-300 disabled:hover:shadow-none"
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        >
          &lt;
        </button>
        <div className="flex items-center">
          <span className="text-sm font-medium">
            Strana {page} od {pages}
          </span>
        </div>
        <button
          className="flex items-center justify-center  px-4 py-2 text-sm font-medium hover:shadow-md disabled:text-gray-300 disabled:hover:shadow-none"
          onClick={() => handlePageChange(page + 1)}
          disabled={page === pages}
        >
          &gt;
        </button>
        <button
          className="flex items-center justify-center  px-4 py-2 text-sm font-medium hover:shadow-md disabled:text-gray-300 disabled:hover:shadow-none"
          onClick={() => handlePageChange(pages)}
          disabled={page === pages}
        >
          &gt;&gt;
        </button>
      </div>
    </div>
  );
};

export default function Search() {
  const { user, error } = useUser();
  const [results, setResults] = useState(null);
  const [count, setCount] = useState(0);
  const {
    query: { ime, page },
  } = useRouter();

  useEffect(() => {
    const rangeFrom = (page - 1) * 10 || 0;
    const rangeTo = page * 10 || 10;

    async function search() {
      const { data, count } = await supabaseClient
        .from("persons")
        .select("id, ime, prezime, rodjenje, smrt, groblje (name)", {
          count: "exact",
        })
        .limit(10)
        .range(rangeFrom, rangeTo)
        .textSearch("fts", ime, { config: "sr", type: "websearch" });
      console.log("data", data);
      console.log("count", count);
      setResults(data);
      setCount(count);
    }

    if (user && ime !== undefined) {
      search();
    }
  }, [ime, page, user]);

  return (
    <div className="container mx-auto">
      <div className="px-5">
        <SearchBar />
      </div>
      <div className="mt-5 flex justify-start">
        <ResultList results={results} />
      </div>
      {results && results.length > 10 && (
        <Paginator count={count} perPage={10} />
      )}
    </div>
  );
}
