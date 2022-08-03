import { useEffect, useState, FormEvent, useMemo } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { RegionData } from "../../types";
import uniqBy from "lodash.uniqby";
import { NextRouter } from "next/router";
import { OptionDropdown } from "../OptionsDropdown";
import { Spinner, Magnifier, AdjustmentsIcon } from "../Icons";

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

interface SearchBarProps {
  options: RegionData[];
  searching: boolean;
  router: NextRouter;
}

export default function SearchBar({
  searching,
  options,
  router,
}: SearchBarProps) {
  const [parent] = useAutoAnimate<HTMLDivElement>();
  const { ime, okrug, opstina, groblje } = router.query;
  const [filtersShown, setFiltersShown] = useState(() =>
    opstina || groblje || okrug ? true : false
  );
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
    if (
      ime !== undefined &&
      typeof ime === "string" &&
      ime !== "" &&
      ime !== "all"
    ) {
      setSearchInput(ime);
    }
    (opstina || groblje || okrug) && setFiltersShown(true);
  }, [opstina, groblje, okrug, ime]);

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

  return (
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
              onClick={() => setFiltersShown(!filtersShown)}
              type="button"
            >
              <AdjustmentsIcon
                className={`h-5 w-5 ${filtersShown ? "text-gray-400" : ""}`}
              />
            </button>
          </div>
        </div>
      </form>
      {filtersShown && (
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
  );
}
