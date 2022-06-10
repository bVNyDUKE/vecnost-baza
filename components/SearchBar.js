import { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Spinner, Magnifier, AdjustmentsIcon } from "./Icons";
import { supabaseClient } from "@supabase/supabase-auth-helpers/nextjs";
import uniqBy from "lodash.uniqby";
import create from "zustand";
import shallow from "zustand/shallow";

// TODO: Generalize the functions below

const filterByGroup = (data, options = {}) => {
  if (options?.groblje && options?.groblje !== "0") {
    data = data.filter((row) => row.grobljeid == options.groblje);
  }
  if (options?.opstina && options?.opstina !== "0") {
    data = data.filter((row) => row.opstinaid == options.opstina);
  }
  if (options?.okrug && options?.okrug !== "0") {
    data = data.filter((row) => row.okrugid == options.okrug);
  }

  const allGroblja = data.map((row) => ({
    name: row.grobljename,
    id: row.grobljeid,
  }));

  const allOpstine = uniqBy(
    data.map((row) => ({
      name: row.opstinaname,
      id: row.opstinaid,
    })),
    "id"
  );

  const allOkruzi = uniqBy(
    data.map((row) => ({
      name: row.okrugname,
      id: row.okrugid,
    })),
    "id"
  );

  return [allOkruzi, allOpstine, allGroblja];
};

// TODO: Extract the options into their own state object
const useStore = create((set, get) => ({
  optionsShown: false,
  allRegionData: [],
  allOpstine: [],
  allOkruzi: [],
  allGroblja: [],
  opstina: null,
  groblje: null,
  okrug: null,
  setOpstina: (opstina) => {
    const [allOkruzi, _allOpstine, allGroblja] = filterByGroup(
      get().allRegionData,
      { opstina }
    );
    set(() => ({ opstina, allOkruzi, allGroblja }));
  },
  setGroblje: (groblje) => {
    const [allOkruzi, allOpstine] = filterByGroup(get().allRegionData, {
      groblje,
    });
    set(() => ({ groblje, allOkruzi, allOpstine }));
  },
  setOkrug: (okrug) => {
    const [_allOkruzi, allOpstine, allGroblja] = filterByGroup(
      get().allRegionData,
      { okrug }
    );
    set(() => ({ okrug, allOpstine, allGroblja }));
  },
  showOptions: async () => {
    if (
      get().allOpstine.length === 0 ||
      get().allOkruzi.length === 0 ||
      get().allGroblja.length === 0
    ) {
      const { data } = await supabaseClient.rpc("region_data");
      const [allOkruzi, allOpstine, allGroblja] = filterByGroup(data);

      set((state) => ({
        optionsShown: !state.optionsShown,
        allOkruzi,
        allGroblja,
        allOpstine,
        allRegionData: data,
      }));
      return;
    }
    set((state) => ({ optionsShown: !state.optionsShown }));
  },
}));

const OptionDropdown = ({ def, options, choice, setChoice }) => (
  <select
    onChange={(e) => setChoice(e.target.value)}
    defaultValue={choice === null ? def : choice}
    className="w-1/3 bg-white p-2 text-center text-sm"
  >
    <option className="text-xs" value="0">
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
  const [
    okrug,
    setOkrug,
    opstina,
    setOpstina,
    groblje,
    setGroblje,
    okruzi,
    opstine,
    groblja,
  ] = useStore(
    (state) => [
      state.okrug,
      state.setOkrug,
      state.opstina,
      state.setOpstina,
      state.groblje,
      state.setGroblje,
      state.allOkruzi,
      state.allOpstine,
      state.allGroblja,
    ],
    shallow
  );

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between text-sm">
        <OptionDropdown
          def="Okrug"
          choice={okrug}
          options={okruzi}
          setChoice={setOkrug}
        />
        <OptionDropdown
          def="Opstina"
          options={opstine}
          choice={opstina}
          setChoice={setOpstina}
        />
        <OptionDropdown
          def="Groblje"
          options={groblja}
          choice={groblje}
          setChoice={setGroblje}
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
