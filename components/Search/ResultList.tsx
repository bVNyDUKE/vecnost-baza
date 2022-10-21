import Link from "next/link";
import { SearchResult } from "../../types";
import ResultIcon from '../../public/resultG.svg';

const Entry = ({ result }: { result: SearchResult }) => {
  return (
    <div className="md:flex mb-5 border border-[#EEEEEE] hover:cursor-pointer hover:shadow-md">
      <div className="md:w-3/6 flex items-center gap-4 p-5">
        <div>
          <svg width="35" height="36" viewBox="0 0 35 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M33.75 31.4999H33V27.75C33 25.113 31.038 22.944 28.5 22.5765V11.25C28.5 5.04597 23.454 0 17.25 0C11.046 0 6.00004 5.04597 6.00004 11.25V22.5765C3.46204 22.944 1.50004 25.113 1.50004 27.75V31.4999H0.750022C0.336023 31.4999 0 31.836 0 32.25V35.25C0 35.664 0.336023 36 0.750022 36H33.7499C34.1639 36 34.5 35.664 34.5 35.25V32.25C34.5 31.836 34.164 31.4999 33.75 31.4999ZM6.00004 31.4999H3.00002V27.75C3.00002 25.9379 4.29004 24.4245 6.00004 24.075V31.4999ZM20.25 21H14.2501C13.8361 21 13.5 20.664 13.5 20.25C13.5 19.836 13.8361 19.4999 14.2501 19.4999H20.25C20.664 19.4999 21.0001 19.836 21.0001 20.25C21.0001 20.664 20.664 21 20.25 21ZM21.75 16.5H12.75C12.336 16.5 12 16.164 12 15.75C12 15.336 12.336 14.9999 12.75 14.9999H21.75C22.164 14.9999 22.5 15.336 22.5 15.75C22.5 16.164 22.164 16.5 21.75 16.5ZM21.75 12H12.75C12.336 12 12 11.664 12 11.25C12 10.836 12.336 10.5 12.75 10.5H21.75C22.164 10.5 22.5 10.836 22.5 11.25C22.5 11.664 22.164 12 21.75 12ZM31.5 31.4999H28.5V24.075C30.21 24.4245 31.5 25.9379 31.5 27.75V31.4999Z" fill="#4D4D4D"/>
          </svg>
        </div>
        <div>
          <span className="text-xl font-semibold">{result.ime} {result.prezime}</span> <br/>
          <span className="text-secondary-dark">({result.rodjenje} - {result.smrt})</span>
          <div className="md:hidden text-sm">{result?.groblje?.name}</div>
        </div>
      </div>

      <div className="md:bg-gray-200 md:w-3/6 px-5 md:p-5 text-secondary-dark mb-3 md:mb-0 hidden md:block">
        <div className="text-lg font-semibold ">Groblje</div>
        <span>{result?.groblje?.name}</span>
      </div>
    </div>
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
    <div className="w-full px-5">
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
