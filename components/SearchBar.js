import { useCallback, useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Spinner, Magnifier, AdjustmentsIcon } from "./Icons";
import { supabaseClient } from "@supabase/supabase-auth-helpers/nextjs";
import uniqBy from "lodash.uniqby";
import create from "zustand";
import shallow from "zustand/shallow";

//TODO use state management for this page

const useStore = create((set, get) => ({
  optionsShown: false,
  regionData: null,
  opstina: null,
  groblje: null,
  okrug: null,
  setOpstina: (opstina) => set((state) => ({ ...state, opstina })),
  setGroblje: (groblje) => set((state) => ({ ...state, groblje })),
  setOkrug: (okrug) => set((state) => ({ ...state, okrug })),
  showOptions: async () => {
    if (!get().regionData) {
      const { data } = await supabaseClient
        .from("groblje")
        .select("id, name, opstina (id, name, okrug (id, name)) ");
      return set((state) => ({
        ...state,
        optionsShown: !state.optionsShown,
        regionData: data,
      }));
    }
    set((state) => ({ ...state, optionsShown: !state.optionsShown }));
  },
  setRegionData: (val) => set({ regionData: val }),
}));

const OptionDropdown = ({ def, options, choice, setChoice }) => (
  <select
    onChange={(e) => setChoice(e.target.value)}
    className="w-1/3 bg-white p-2 text-center text-sm"
  >
    <option selected={choice === null} className="text-xs" disabled value="">
      {def}
    </option>
    {options.map((option) => (
      <option
        selected={choice == option.id}
        className="text-clip text-xs"
        key={option.id}
        value={option.id}
      >
        {option.name}
      </option>
    ))}
  </select>
);

const AdvancedOptions = () => {
  const [okrug, setOkrug] = useStore((state) => [state.okrug, state.setOkrug]);
  const [opstina, setOpstina] = useStore((state) => [
    state.opstina,
    state.setOpstina,
  ]);
  const [groblje, setGroblje] = useStore((state) => [
    state.groblje,
    state.setGroblje,
  ]);
  const regionData = useStore((state) => state.regionData);

  const groblja = useMemo(() => {
    if (!regionData) return [];
    return regionData.map((groblje) => ({
      name: groblje.name,
      id: groblje.id,
    }));
  }, [regionData]);

  const opstine = useMemo(() => {
    if (!regionData) return [];
    return uniqBy(
      regionData.map((groblje) => ({
        name: groblje.opstina.name,
        id: groblje.opstina.id,
      })),
      "id"
    );
  }, [regionData]);

  const okruzi = useMemo(() => {
    if (!regionData) return [];
    return uniqBy(
      regionData.map((groblje) => ({
        name: groblje.opstina.okrug.name,
        id: groblje.opstina.okrug.id,
      })),
      "id"
    );
  }, [regionData]);

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
