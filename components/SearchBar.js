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
    <div className="m-auto flex h-16 w-full max-w-3xl items-center space-x-8 rounded-md border border-gray-300 bg-white shadow-md">
      <div className="ml-8">{searching ? <Spinner /> : <Magnifier />}</div>
      <input
        type="text"
        name="search"
        id="search"
        onChange={searchChange}
        onKeyUp={(e) => (e.code = "Enter" && searchChange(e))}
        placeholder="Pretraga..."
        className="flex-grow focus:outline-none"
      />
    </div>
  );
}
