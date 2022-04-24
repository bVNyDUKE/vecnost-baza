import { useState } from "react";
import { Magnifier, Spinner } from "./Icons";
import { supabase } from "../utils/supabaseClient";

var timeout;
export default function SearchBar({ setResults }) {
  const [searching, setSearching] = useState(false);

  function searchChange(e) {
    clearTimeout(timeout);
    setSearching(true);
    timeout = setTimeout(async () => {
      setSearching(false);
      const cleanedInput = e.target.value
        .replace(/dj/g, "đ")
        .replace(/Dj/g, "Đ");
      const { data } = await supabase
        .from("persons")
        .select()
        .textSearch("fts", cleanedInput, { config: "sr", type: "websearch" });
      setResults(data);
      console.log(data);
    }, 1000);
  }

  return (
    <div className="text-gray-950 flex h-16 w-full items-center space-x-8 rounded-md border border-gray-300 bg-white shadow-md lg:w-1/3">
      <div className="ml-8">{searching ? <Spinner /> : <Magnifier />}</div>
      <input
        type="text"
        name="search"
        id="search"
        onChange={searchChange}
        onKeyUp={(e) => (e.code = "Enter" && searchChange(e))}
        placeholder="Pretraga..."
        className="text-grey-950 flex-grow  focus:outline-none"
      />
    </div>
  );
}
