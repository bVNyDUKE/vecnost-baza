import { useEffect, useState, FormEvent } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { NextRouter } from "next/router";
import { RegionData } from "../../types";
import { Spinner, Magnifier, AdjustmentsIcon } from "../Icons";
import OptionDropdown from "../OptionsDropdown";

const AvailableFilters = {
  opstina: "opstina",
  groblje: "groblje",
  okrug: "okrug",
} as const;
const filterList = Object.values(AvailableFilters);

interface FilterValues {
  id: string;
  name: string;
}
type SelectedFilters = Record<keyof typeof AvailableFilters, string | null>;

function removeDuplicates(input: Array<FilterValues>) {
  return input.reduce<typeof input>((prev, current) => {
    if (prev.find((x) => x.id === current.id) === undefined) {
      prev.push(current);
    }
    return prev;
  }, []);
}

function generateDropdownOptions(
  data: RegionData[],
  filters: SelectedFilters
): Record<keyof SelectedFilters, FilterValues[]> {
  const dropdownOptions = Object.create(AvailableFilters);

  filterList.forEach((name) => {
    if (filters[name] && filters[name] !== "0") {
      data = data.filter((row) => row[`${name}id`] === filters[name]);
    }
  });

  filterList.forEach((name) => {
    dropdownOptions[name] = removeDuplicates(
      data.map((row) => ({
        name: row[`${name}name`],
        id: row[`${name}id`],
      }))
    );
  });

  return dropdownOptions;
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
  const [filtersShown, setFiltersShown] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({
    opstina: null,
    groblje: null,
    okrug: null,
  });
  const availableFilters = generateDropdownOptions(options, selectedFilters);

  useEffect(() => {
    filterList.forEach((filter) => {
      if (router.query[filter] && typeof router.query[filter] === "string") {
        setSelectedFilters((prev) => ({
          ...prev,
          [filter]: router.query[filter],
        }));
        setFiltersShown(true);
      }
    });

    const { ime } = router.query;
    if (
      ime !== undefined &&
      typeof ime === "string" &&
      ime !== "" &&
      ime !== "all"
    ) {
      setSearchInput(ime);
    }
  }, [router.query]);

  //handle search input
  const [searchInput, setSearchInput] = useState("");
  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const ime = searchInput.replace(/dj/g, "đ").replace(/Dj/g, "Đ");
    router.push(
      {
        pathname: "/pretraga",
        query: {
          ime,
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
            {filterList.map((option) => (
              <OptionDropdown
                key={option}
                label={option}
                choice={selectedFilters[option]}
                options={availableFilters[option]}
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
