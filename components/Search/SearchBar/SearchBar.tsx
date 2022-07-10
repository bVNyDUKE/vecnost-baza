import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useSearchStore } from "../../../stores/searchStore";
import { AdvancedOptions } from "./AdvancedOptions";
import { Spinner, Magnifier, AdjustmentsIcon } from "../../Icons";

export const SearchBar = ({ searching }: { searching: boolean }) => {
  const router = useRouter();
  const { opstina, groblje, okrug, ime } = router.query;
  const [parent] = useAutoAnimate<HTMLDivElement>();
  const [search, setSearch] = useState<string | string[]>("");
  const [optionsShown, setOptionsShown] = useState(() =>
    opstina || groblje || okrug ? true : false
  );
  const filters = useSearchStore((state) => state.filter);
  const setOption = useSearchStore((state) => state.setOption);
  const getOptions = useSearchStore((state) => state.getOptions);

  useEffect(() => {
    getOptions();
  }, [getOptions]);

  useEffect(() => {
    setSearch((ime !== "all" && ime) || "");
    if (opstina && typeof opstina === "string") {
      setOption("opstina", opstina);
    }
    if (groblje && typeof groblje === "string") {
      setOption("groblje", groblje);
    }
    if (okrug && typeof okrug === "string") {
      setOption("okrug", okrug);
    }
  }, [ime, opstina, groblje, okrug, setOption]);

  const handleSearch = (searchInput: string | string[]) => {
    if (typeof searchInput !== "string") {
      searchInput = searchInput.join(" ");
    }
    const cleanedInput = searchInput.replace(/dj/g, "đ").replace(/Dj/g, "Đ");

    router.push(
      {
        pathname: "/search",
        query: {
          ime: cleanedInput,
          ...(filters.groblje && { groblje: filters.groblje }),
          ...(filters.opstina && { opstina: filters.opstina }),
          ...(filters.okrug && { okrug: filters.okrug }),
        },
      },
      "",
      { shallow: true }
    );
  };

  const handleChange = (e: React.FormEvent<HTMLInputElement>) =>
    setSearch(e.currentTarget.value);

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) =>
    e.key == "Enter" && handleSearch(e.currentTarget.value);

  return (
    <div ref={parent} className="m-auto max-w-3xl px-5">
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
            {searching ? <Spinner /> : <Magnifier />}
          </button>
          <button
            className="flex h-full w-10 items-center justify-center hover:shadow-md"
            onClick={() => setOptionsShown(!optionsShown)}
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
};
