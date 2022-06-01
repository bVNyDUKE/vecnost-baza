import { useCallback, useState, useEffect } from "react";
import Icon from "./Icons";
import { useRouter } from "next/router";

export default function SearchBar() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (router.query.ime !== undefined) {
      setSearch(router.query.ime);
    }
  }, [router.query.ime]);

  const handleChange = useCallback(
    (e) => setSearch(e.target.value),
    [setSearch]
  );

  const handleSearch = useCallback(
    (searchInput) => {
      const cleanedInput = searchInput.replace(/dj/g, "đ").replace(/Dj/g, "Đ");
      router.push({ pathname: "/search", query: { ime: cleanedInput } });
    },
    [router]
  );

  const handleKeyUp = useCallback(
    (e) => e.key == "Enter" && handleSearch(e.target.value),
    [handleSearch]
  );

  return (
    <div className="m-auto flex h-16 w-full max-w-3xl items-center space-x-8 rounded-md border border-gray-300 bg-white shadow-md">
      <div className="ml-8">
        <Icon.Magnifier />
      </div>
      <input
        type="text"
        name="search"
        id="search"
        value={search}
        onChange={handleChange}
        onKeyUp={handleKeyUp}
        placeholder="Pretraga..."
        className="flex-grow focus:outline-none"
      />
    </div>
  );
}
