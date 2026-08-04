import { useState, SubmitEvent, useMemo } from "react";
import { useRouter } from "next/router";
import { RegionData } from "../../types";
import { Magnifier, AdjustmentsIcon } from "../Icons";
import OptionDropdown from "../OptionsDropdown";
import { ParsedUrlQuery } from "node:querystring";

const AcceptedFilters = {
  opstina: "opstina",
  groblje: "groblje",
  okrug: "okrug",
} as const;
const filterList = ["opstina", "groblje", "okrug"] as const;

interface FilterValues {
  id: string;
  name: string;
}
type SelectedFilters = Record<keyof typeof AcceptedFilters, string | null>;
type AvailableFilters = Record<keyof SelectedFilters, FilterValues[]>;

interface SearchBarProps {
  options: RegionData[];
  icon?: React.ReactNode;
}

function initializeFilters(query: ParsedUrlQuery) {
  const initialFilters: Record<typeof filterList[number], string | null> = {
    opstina: null,
    groblje: null,
    okrug: null,
  };

  for (const filter of filterList) {
    const q = query[filter];
    if (q && typeof q === "string") {
      initialFilters[filter as keyof typeof initialFilters] = q;
    }
  }
  return initialFilters;
}

function initializeFiltersShown(query: ParsedUrlQuery) {
  for (const filter of filterList) {
    const q = query[filter];
    if (q && typeof q === "string") {
      return true;
    }
  }
  return false;
}

export default function SearchBar({
  options,
  icon = <Magnifier />,
}: SearchBarProps) {
  const router = useRouter();

  const [selectedFilters, setSelectedFilters] = useState(() =>
    initializeFilters(router.query)
  );
  const [filtersShown, setFiltersShown] = useState(() =>
    initializeFiltersShown(router.query)
  );
  const [searchInput, setSearchInput] = useState(() =>
    typeof router.query.ime === "string" ? router.query.ime : ""
  );

  const availableFilters = useMemo((): AvailableFilters => {
    const dropdownOptions = Object.create(AcceptedFilters);

    let opts = [...options];

    filterList.forEach((name) => {
      if (selectedFilters[name] && selectedFilters[name] !== "0") {
        opts = opts.filter((row) => row[`${name}id`] === selectedFilters[name]);
      }
    });

    filterList.forEach((name) => {
      dropdownOptions[name] = opts
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
  }, [options, selectedFilters]);

  const handleSearch = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const ime = searchInput.replace(/dj/g, "đ").replace(/Dj/g, "Đ");
    router.push({
      pathname: "/pretraga",
      query: {
        ime,
        ...(selectedFilters.groblje && { groblje: selectedFilters.groblje }),
        ...(selectedFilters.opstina && { opstina: selectedFilters.opstina }),
        ...(selectedFilters.okrug && { okrug: selectedFilters.okrug }),
      },
    });
  };

  return (
    <div className="m-auto max-w-3xl px-5">
      <form onSubmit={(e) => handleSearch(e)}>
        <div className="flex items-center justify-center border border-gray-300">
          <div className="flex h-16 w-full shrink items-center space-x-8 hover:shadow-md">
            <input
              type="text"
              name="search"
              id="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Pretraga..."
              className="h-full grow p-5 focus:outline-hidden"
            />
          </div>
          <div className="flex h-16 w-28 grow border-l ">
            <button
              className="flex h-full w-full grow items-center justify-center border-r hover:shadow-md"
              type="submit"
            >
              {icon}
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
