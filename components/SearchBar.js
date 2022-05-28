import { useState, useCallback } from "react";
import Icon from "./Icons";
import { supabase } from "../utils/supabaseClient";

var timeout;
export default function SearchBar({ setResults }) {
  const [searching, setSearching] = useState(false);

  const onSearch = useCallback(
    (e) => {
      clearTimeout(timeout);
      setSearching(true);
      timeout = setTimeout(async () => {
        setSearching(false);
        const cleanedInput = e.target.value
          .replace(/dj/g, "đ")
          .replace(/Dj/g, "Đ");
        const { data } = await supabase
          .from("persons")
          .select("id, ime, prezime, rodjenje, smrt, groblje (name)")
          .textSearch("fts", cleanedInput, { config: "sr", type: "websearch" });
        setResults(data);
        console.log(data);
      }, 1000);
    },
    [setResults]
  );

  return (
    <div className="m-auto flex h-16 w-full max-w-3xl items-center space-x-8 rounded-md border border-gray-300 bg-white shadow-md">
      <div className="ml-8">
        {searching ? <Icon.Spinner /> : <Icon.Magnifier />}
      </div>
      <input
        type="text"
        name="search"
        id="search"
        onChange={onSearch}
        onKeyUp={(e) => (e.code = "Enter" && onSearch(e))}
        placeholder="Pretraga..."
        className="flex-grow focus:outline-none"
      />
    </div>
  );
}
