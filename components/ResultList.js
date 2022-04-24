import Link from "next/link";
import { forwardRef } from "react";

// eslint-disable-next-line react/display-name
const Entry = forwardRef(({ result, onClick, href }, ref) => {
  return (
    <a href={href} onClick={onClick} ref={ref}>
      <ul className="mb-5 w-full border-b border-gray-300 p-2 hover:cursor-pointer hover:shadow-xl">
        <li>
          Ime: {result.ime} {result.prezime} : {result.rodjenje} - {result.smrt}
        </li>
        <li>Groblje: {result.groblje}</li>
      </ul>
    </a>
  );
});

export default function ResultList({ results }) {
  if (results !== null && results.length === 0) {
    return (
      <div className="m-auto text-center">Nema rezultata za ovu pretragu</div>
    );
  }
  return (
    <div className="m-auto space-y-5">
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
