import Link from "next/link";

function Entry({ result }) {
  return (
    <ul className="mb-5 border-b w-full border-gray-300 p-2 shadow-md hover:cursor-pointer hover:shadow-xl">
      <li>
        Ime: {result.ime} {result.prezime} : {result.rodjenje} - {result.smrt}
      </li>
      <li>Groblje: {result.groblje}</li>
    </ul>
  );
}

export default function ResultList({ results }) {
  return (
    <div className="space-y-5">
      {results &&
        results.map((result) => (
          <Link
            passHref
            key={result.id}
            href={{ pathname: "/entries/[id]", query: { id: result.id } }}
          >
            <Entry result={result} />
          </Link>
        ))}
    </div>
  );
}
