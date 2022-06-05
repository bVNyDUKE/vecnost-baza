import SearchBar from "../components/SearchBar";
import ResultList from "../components/ResultList";
import { useRouter } from "next/router";
import { useEffect, useState, useCallback } from "react";
import {
  withPageAuth,
  supabaseClient,
} from "@supabase/supabase-auth-helpers/nextjs";

export const getServerSideProps = withPageAuth({ redirectTo: "/login" });

const Paginator = ({ count, perPage }) => {
  const router = useRouter();
  const [page, setPage] = useState(router.query.page || 1);
  const [pages, setPages] = useState(Math.ceil(count / perPage));

  useEffect(() => {
    setPages(Math.ceil(count / perPage));
  }, [count, perPage]);

  const handlePageChange = useCallback(
    (page) => {
      setPage(page);
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
  const [results, setResults] = useState(null);
  const [count, setCount] = useState(0);
  const {
    query: { ime, page },
  } = useRouter();

  useEffect(() => {
    const rangeFrom = (page - 1) * 10;
    const rangeTo = page * 10;

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

    if (ime !== undefined) {
      search();
    }
  }, [ime, page]);

  return (
    <>
      <div className="container mx-auto px-5">
        <SearchBar />
      </div>
      <div className="mt-5 flex justify-start">
        <ResultList results={results} />
      </div>
      <Paginator count={count} perPage={10} />
    </>
  );
}
