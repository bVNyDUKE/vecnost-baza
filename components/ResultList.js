import Link from "next/link";

export default function ResultList(results) {
  return (
    <>
      {results !== null && results.length > 0 && (
        <div className="grid grid-cols-4 gap-8">
          {results.map((result) => (
            <Link
              passHref
              key={result.id}
              href={{ pathname: "/entries/[id]", query: { id: result.id } }}
            >
              <ul className="mb-5 border border-gray-300 p-2 w-32 h-44 shadow-md hover:cursor-pointer hover:shadow-xl">
                <li>
                  Ime: {result.ime} {result.prezime}
                </li>
                <li>Rodjenje: {result.rodjenje}</li>
                <li>Smrt: {result.smrt}</li>
                <li>Groblje: {result.groblje}</li>
              </ul>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
