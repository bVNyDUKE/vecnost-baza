import Link from "next/link";
import { SearchResult } from "../../types";

const Entry = ({ result }: { result: SearchResult }) => {
  return (
    <ul className="mb-5 w-full border-b border-gray-300 p-2 hover:cursor-pointer hover:shadow-xl">
      <li>
        <span className="text-gray-500">Ime: </span>
        {result.ime} {result.prezime}
      </li>
      <li>
        {result.rodjenje} - {result.smrt}
      </li>
      <li>
        <span className="text-gray-500">Groblje: </span>
        {result?.groblje?.name}
      </li>
    </ul>
  );
};

export default function ResultList({
  results,
}: {
  results: SearchResult[] | null;
}) {
  if (results === null || results.length === 0) {
    return <div className="m-auto">Nema rezultata za ovu pretragu</div>;
  }
  return (
    <div className="m-auto space-y-5">
      {results &&
        results.map((result) => (
          <Link
            passHref
            key={result.id}
            href={{ pathname: "/lica/[id]", query: { id: result.id } }}
          >
            <a>
              <Entry result={result} />
            </a>
          </Link>
        ))}
    </div>
  );
}
