import { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Spinner, Magnifier, AdjustmentsIcon } from "./Icons";
import { supabaseClient } from "@supabase/supabase-auth-helpers/nextjs";
import uniqBy from "lodash.uniqby";
import create from "zustand";
import shallow from "zustand/shallow";

const generateOptions = (data, filters = {}) => {
  Object.keys(filters).forEach((key) => {
    if (filters[key] !== "0") {
      data = data.filter((row) => row[`${key}id`] == filters[key]);
    }
  });

  const options = { groblje: [], opstina: [], okrug: [] };

  Object.keys(options).forEach((key) => {
    options[key] = uniqBy(
      data.map((row) => ({
        name: row[`${key}name`],
        id: row[`${key}id`],
      })),
      "id"
    );
  });

  return options;
};

const useStore = create((set, get) => ({
  optionsShown: false,
  allOptions: [],
  options: {
    okrug: [],
    opstina: [],
    groblje: [],
  },
  filter: {
    opstina: null,
    groblje: null,
    okrug: null,
  },
  setOption: (name, value) => {
    const options = generateOptions(get().allOptions, { [name]: value });
    options[name] = get().options[name];
    set(() => ({ filter: { [name]: value }, options }));
  },
  showOptions: async () => {
    if (get().allOptions.length === 0) {
      const { data } = await supabaseClient.rpc("region_data");
      const options = generateOptions(data);

      set((state) => ({
        optionsShown: !state.optionsShown,
        allOptions: data,
        options,
      }));
      return;
    }
    set((state) => ({ optionsShown: !state.optionsShown }));
  },
}));

const OptionDropdown = ({ def, options, choice, setChoice }) => (
  <select
    onChange={(e) => setChoice(def, e.target.value)}
    defaultValue={choice === null ? def : choice}
    className="w-1/3 bg-white p-2 text-center text-sm capitalize"
  >
    <option className="text-xs capitalize" value="0">
      {def}
    </option>
    {options.map((option) => (
      <option className="text-clip text-xs" key={option.id} value={option.id}>
        {option.name}
      </option>
    ))}
  </select>
);

const AdvancedOptions = () => {
  const [filter, options, setOption] = useStore(
    (state) => [state.filter, state.options, state.setOption],
    shallow
  );

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between text-sm">
        <OptionDropdown
          def="okrug"
          choice={filter.okrug}
          options={options.okrug}
          setChoice={setOption}
        />
        <OptionDropdown
          def="opstina"
          choice={filter.opstina}
          options={options.opstina}
          setChoice={setOption}
        />
        <OptionDropdown
          def="groblje"
          choice={filter.groblje}
          options={options.groblje}
          setChoice={setOption}
        />
      </div>
    </div>
  );
};

export default function SearchBar() {
  const router = useRouter();
  const [parent] = useAutoAnimate();
  const [search, setSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const { optionsShown, showOptions } = useStore(
    (state) => ({
      optionsShown: state.optionsShown,
      showOptions: state.showOptions,
    }),
    shallow
  );

  useEffect(() => {
    setIsSearching(false);
    if (router.query.ime !== undefined) {
      setSearch(router.query.ime);
    }
  }, [router.query.ime]);

  const handleSearch = useCallback(
    (searchInput) => {
      const cleanedInput = searchInput.replace(/dj/g, "đ").replace(/Dj/g, "Đ");
      if (router.query.ime !== cleanedInput) {
        setIsSearching(true);
        router.push({ pathname: "/search", query: { ime: cleanedInput } });
      }
    },
    [router]
  );

  const handleChange = useCallback(
    (e) => setSearch(e.target.value),
    [setSearch]
  );

  const handleKeyUp = useCallback(
    (e) => e.key == "Enter" && handleSearch(e.target.value),
    [handleSearch]
  );

  return (
    <div ref={parent} className="m-auto max-w-3xl">
      <div className="flex items-center justify-center rounded-md border border-gray-300">
        <div className="flex h-16 w-full flex-shrink items-center space-x-8 hover:shadow-md">
          <input
            type="text"
            name="search"
            id="search"
            value={search}
            onChange={handleChange}
            onKeyUp={handleKeyUp}
            placeholder="Pretraga..."
            className="h-full flex-grow p-5 focus:outline-none"
          />
        </div>
        <div className="flex h-16 w-28 flex-grow border-l ">
          <button
            className="flex h-full w-full flex-grow items-center justify-center border-r hover:shadow-md"
            onClick={() => handleSearch(search)}
          >
            {isSearching ? <Spinner /> : <Magnifier />}
          </button>
          <button
            className="flex h-full w-10 items-center justify-center hover:shadow-md"
            onClick={showOptions}
          >
            <AdjustmentsIcon
              className={`h-5 w-5 ${optionsShown ? "text-gray-400" : ""}`}
            />
          </button>
        </div>
      </div>
      {optionsShown && <AdvancedOptions />}
    </div>
  );
}
