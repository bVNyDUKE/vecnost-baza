import { supabase } from "../lib/supabaseClient";
import { RegionData } from "../types";
import Paginator from "../components/Search/Paginator";
import ResultList from "../components/Search/ResultList";
import SearchBar from "../components/Search/SearchBar";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";

export const getServerSideProps = (async ({ query }) => {
  const { data: regionData, error: regionError } =
    await supabase.rpc<RegionData>("region_data");

  if (regionError)
    throw new Error(`no region data found for search: ${regionError}`);

  const { ime, okrug, opstina, groblje, page = 1 } = query;
  const pageNumber = +page;

  if (ime === undefined || ime === "") {
    return { props: { options: regionData } };
  }

  const from = (pageNumber - 1) * 10 || 0;
  let searchQuery = supabase
    .from("persons")
    .select(
      "id, ime, prezime, rodjenje, smrt, groblje!inner(id, name, opstina!inner(id, name, okrug!inner(id,name)))",
      {
        count: "exact",
      }
    )
    .limit(10)
    .range(from, from + 9);

  if (ime && typeof ime === "string" && ime !== "all") {
    searchQuery = searchQuery.textSearch("fts", ime as string, {
      config: "sr",
      type: "websearch",
    });
  }

  if (groblje) {
    searchQuery = searchQuery.eq("groblje.id", groblje);
  }
  if (opstina) {
    searchQuery = searchQuery.eq("groblje.opstina.id", opstina);
  }
  if (okrug) {
    searchQuery = searchQuery.eq("groblje.opstina.okrug.id", okrug);
  }

  const { data: results, count, error } = await searchQuery;
  if (error) {
    throw new Error(`error searching ${error}`);
  }

    return { props: { options: regionData, results, count } };
}) satisfies GetServerSideProps;

export default function Search({
  options,
  results,
  count,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();

  const handlePageChange = (page: number) => {
    router.push({
      pathname: "/pretraga",
      query: { ...router.query, page: page },
    });
  };

  return (
    <div className="container mx-auto max-w-3xl">
      <SearchBar options={options} />

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
