import { useEffect, useState, FormEvent } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { NextRouter } from "next/router";
import { RegionData } from "../../types";
import { Spinner, Magnifier, AdjustmentsIcon } from "../Icons";
import OptionDropdown from "../OptionsDropdown";

const AcceptedFilters = {
  opstina: "opstina",
  groblje: "groblje",
  okrug: "okrug",
} as const;
const filterList = Object.values(AcceptedFilters);

interface FilterValues {
  id: string;
  name: string;
}
type SelectedFilters = Record<keyof typeof AcceptedFilters, string | null>;
type AvailableFilters = Record<keyof SelectedFilters, FilterValues[]>;
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
  const availableFilters = ((): AvailableFilters => {
    const dropdownOptions = Object.create(AcceptedFilters);

    filterList.forEach((name) => {
      if (selectedFilters[name] && selectedFilters[name] !== "0") {
        options = options.filter(
          (row) => row[`${name}id`] === selectedFilters[name]
        );
      }
    });

    filterList.forEach((name) => {
      dropdownOptions[name] = options
        .map((row) => ({
          name: row[`${name}name`],
          id: row[`${name}id`],
        }))
        .reduce<FilterValues[]>((prev, curr) => {
          if (prev.find((x) => x.id === curr.id) === undefined) {
            prev.push(curr);
          }
          return prev;
        }, []);
    });

    return dropdownOptions;
  })();

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
            {filterList.map((name) => (
              <OptionDropdown
                key={name}
                label={name}
                choice={selectedFilters[name]}
                options={availableFilters[name]}
                setChoice={(choice: string) =>
                  setSelectedFilters((prev) => ({
                    ...prev,
                    [name]: choice,
                  }))
                }
                clearChoice={() =>
                  setSelectedFilters((prev) => ({ ...prev, [name]: null }))
                }
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
