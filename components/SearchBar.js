import { useCallback, useState, useEffect } from "react";
import { Spinner, Magnifier } from "./Icons";
import { useRouter } from "next/router";

export default function SearchBar() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    setIsSearching(false);
    if (router.query.ime !== undefined) {
      setSearch(router.query.ime);
    }
  }, [router.query.ime]);

  const handleChange = useCallback(
    (e) => setSearch(e.target.value),
    [setSearch]
  );

  const handleKeyUp = useCallback(
    (e) => e.key == "Enter" && handleSearch(e.target.value),
    [handleSearch]
  );

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

  return (
    <div className="m-auto flex w-full max-w-3xl items-center justify-center rounded-md border border-gray-300">
      <div className="flex h-16 w-full max-w-3xl flex-shrink items-center space-x-8 hover:shadow-md">
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
      <button
        className="h-16 w-20 flex-grow border-l hover:shadow-md"
        onClick={() => handleSearch(search)}
      >
        <div className="flex justify-center">
          {isSearching ? <Spinner /> : <Magnifier />}
        </div>
      </button>
    </div>
  );
}
