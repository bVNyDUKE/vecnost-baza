import { useState } from "react";
import { Magnifier, Spinner } from "./Icons";
import { supabase } from "../utils/supabaseClient";

var timeout;
export default function SearchBar({setResults}) {
  const [searching, setSearching] = useState(false);

  function searchChange(e) {
    clearTimeout(timeout);
    setSearching(true);
    timeout = setTimeout(async () => {
      setSearching(false);
      const { data } = await supabase.from('persons').select().textSearch('fts', e.target.value, {config: 'sr', type: 'websearch'})
      setResults(data)
      console.log(data)
    }, 1000);
  }

  return (
    <div className="bg-white border border-gray-300 w-full lg:w-1/3 h-16 flex items-center space-x-8 rounded-md shadow-md text-gray-950">
      <div className="ml-8">
        {searching ? ( <Spinner />) : ( <Magnifier />)}
      </div>
      <input
        type="text"
        name="search"
        id="search"
        onChange={searchChange}
        placeholder="Pretraga..."
        className="flex-grow focus:outline-none  text-grey-950"
      />
    </div>
  );
}
