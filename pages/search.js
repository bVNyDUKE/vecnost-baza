import { useState } from "react";
import SearchBar from "../components/SearchBar";
import ResultList from "../components/ResultList";

export default function Home() {
  const [results, setResults] = useState(null);

  return (
    <>
      <div className="px-5">
        <SearchBar setResults={setResults} />
      </div>
      <div className="mt-5 flex justify-start">
        <ResultList results={results} />
      </div>
    </>
  );
}
