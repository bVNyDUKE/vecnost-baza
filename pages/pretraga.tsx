import { supabase } from "../lib/supabaseClient";
import { RegionData } from "../types";
import Paginator from "../components/Search/Paginator";
import ResultList from "../components/Search/ResultList";
import SearchBar from "../components/Search/SearchBar";
import { usePaginatedSearch } from "../hooks/usePaginatedSearch";
import { Magnifier, Spinner } from "../components/Icons";

export async function getStaticProps() {
  const { data } = await supabase.rpc<RegionData>("region_data");
  return { props: { options: data }, revalidate: 60 * 60 * 24 };
}

export default function Search({ options }: { options: RegionData[] }) {
  const { results, count, searching, handlePageChange } = usePaginatedSearch();

  return (
    <div className="container mx-auto max-w-3xl">
      <SearchBar
        options={options}
        icon={searching ? <Spinner /> : <Magnifier />}
      />

      <div className="relative my-5 flex justify-center">
        {results && <ResultList results={results} />}
      </div>

      {results && count !== null && count > 10 && (
        <Paginator
          count={count || 0}
          perPage={10}
          handlePageChange={handlePageChange}
        />
      )}
    </div>
  );
}
