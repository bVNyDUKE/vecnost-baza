import { useEffect, useState, FormEvent, useMemo } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { OptionDropdown } from "../components/OptionsDropdown";
import { Spinner, Magnifier, AdjustmentsIcon } from "../components/Icons";
import { ResultList } from "../components/Search/Results/ResultList";
import { Paginator } from "../components/Search/Results/Paginator";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";
import { RegionData, SearchResult } from "../types";
import uniqBy from "lodash.uniqby";

function generateDropdownOptions(
  data: RegionData[],
  selectedOpstina: null | string,
  selectedGroblje: null | string,
  selectedOkrug: null | string
) {
  if (selectedOpstina && selectedOpstina !== "0") {
    data = data.filter((row) => row.opstinaid === selectedOpstina);
  }
  if (selectedOkrug && selectedOkrug !== "0") {
    data = data.filter((row) => row.okrugid === selectedOkrug);
  }
  if (selectedGroblje && selectedGroblje !== "0") {
    data = data.filter((row) => row.grobljeid === selectedGroblje);
  }
  return {
    okrug: uniqBy(
      data.map((row) => ({
        name: row.okrugname,
        id: row.okrugid,
      })),
      "id"
    ),
    opstina: uniqBy(
      data.map((row) => ({
        name: row.opstinaname,
        id: row.opstinaid,
      })),
      "id"
    ),
    groblje: uniqBy(
      data.map((row) => ({
        name: row.grobljename,
        id: row.grobljeid,
      })),
      "id"
    ),
  };
}

export async function getStaticProps() {
  const { data } = await supabase.rpc<RegionData>("region_data");
  return { props: { options: data }, revalidate: 60 * 60 * 24 };
}

export default function Search({ options }: { options: RegionData[] }) {
  const [parent] = useAutoAnimate<HTMLDivElement>();
  const [results, setResults] = useState<null | SearchResult[]>(null);
  const [searching, setSearching] = useState(false);
  const [count, setCount] = useState<number | null>(0);

  const [selectedFilters, setSelectedFilters] = useState<{
    opstina: string | null;
    groblje: string | null;
    okrug: string | null;
  }>({
    opstina: null,
    groblje: null,
    okrug: null,
  });
  const availableFilters = useMemo(
    () =>
      generateDropdownOptions(
        options,
        selectedFilters.opstina,
        selectedFilters.groblje,
        selectedFilters.okrug
      ),
    [
      options,
      selectedFilters.opstina,
      selectedFilters.groblje,
      selectedFilters.okrug,
    ]
  );

  const router = useRouter();
  const {
    query: { ime, okrug, opstina, groblje },
  } = router;
  const page = parseInt(router.query.page as string) || 1;

  const [optionsShown, setOptionsShown] = useState(() =>
    opstina || groblje || okrug ? true : false
  );

  //handle search input
  const [searchInput, setSearchInput] = useState("");
  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const cleanedInput = searchInput.replace(/dj/g, "đ").replace(/Dj/g, "Đ");
    router.push(
      {
        pathname: "/pretraga",
        query: {
          ime: cleanedInput,
          ...(selectedFilters.groblje && { groblje: selectedFilters.groblje }),
          ...(selectedFilters.opstina && { opstina: selectedFilters.opstina }),
          ...(selectedFilters.okrug && { okrug: selectedFilters.okrug }),
        },
      },
      "",
      { shallow: true }
    );
  };

  useEffect(() => {
    if (opstina && typeof opstina === "string") {
      setSelectedFilters((prev) => ({ ...prev, opstina }));
    }
    if (groblje && typeof groblje === "string") {
      setSelectedFilters((prev) => ({ ...prev, groblje }));
    }
    if (okrug && typeof okrug === "string") {
      setSelectedFilters((prev) => ({ ...prev, okrug }));
    }
    opstina || groblje || (okrug && setOptionsShown(true));

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
      setSearchInput(ime);
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
      <div ref={parent} className="m-auto max-w-3xl px-5">
        <form onSubmit={(e) => handleSearch(e)}>
          <div className="flex items-center justify-center rounded-md border border-gray-300">
            <div className="flex h-16 w-full flex-shrink items-center space-x-8 hover:shadow-md">
              <input
                type="text"
                name="search"
                id="search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Pretraga..."
                className="h-full flex-grow p-5 focus:outline-none"
              />
            </div>
            <div className="flex h-16 w-28 flex-grow border-l ">
              <button
                className="flex h-full w-full flex-grow items-center justify-center border-r hover:shadow-md"
                type="submit"
              >
                {searching ? <Spinner /> : <Magnifier />}
              </button>
              <button
                className="flex h-full w-10 items-center justify-center hover:shadow-md"
                onClick={() => setOptionsShown(!optionsShown)}
                type="button"
              >
                <AdjustmentsIcon
                  className={`h-5 w-5 ${optionsShown ? "text-gray-400" : ""}`}
                />
              </button>
            </div>
          </div>
        </form>
        {optionsShown && (
          <div className="mb-10">
            <div className="flex h-10 items-center justify-between">
              {["okrug", "opstina", "groblje"].map((option) => (
                <OptionDropdown
                  key={option}
                  label={option}
                  choice={
                    selectedFilters[option as "okrug" | "opstina" | "groblje"]
                  }
                  options={
                    availableFilters[option as "okrug" | "opstina" | "groblje"]
                  }
                  setChoice={(choice: string) =>
                    setSelectedFilters((prev) => ({
                      ...prev,
                      [option]: choice,
                    }))
                  }
                  clearChoice={() =>
                    setSelectedFilters((prev) => ({ ...prev, [option]: null }))
                  }
                />
              ))}
            </div>
          </div>
        )}
      </div>

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
