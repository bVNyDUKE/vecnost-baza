import { useState, useMemo } from "react";
import { supabase } from "../lib/supabaseClient";
import { RightArrow, DownArrow } from "../components/Icons";
import { Region } from "../types";

export async function getStaticProps() {
  const { data } = await supabase
    .from<Omit<Region, "groblje" | "opstina">>("region")
    .select(
      "id, name, okrug ( id, name, opstina (id, name, groblje (id, name) ) )"
    );
  return { props: { data }, revalidate: 60 * 60 * 24 };
}

const IndexList = ({ data, title }: { data?: Region[]; title: string }) => {
  return (
    <div className="mt-5 mb-5 font-serif">
      <h2 className="ml-5 text-3xl">{title}</h2>
      <ul className="mt-2 ml-7 list-inside">
        {data &&
          data.map((entry) => <IndexEntry key={entry.id} entry={entry} />)}
      </ul>
    </div>
  );
};

let AREAS = {
  okrug: "Okruzi",
  opstina: "Opštine",
  groblje: "Groblja",
} as const;

const IndexEntry = ({ entry }: { entry: Region }) => {
  const [open, setOpen] = useState(false);

  const { subListName, subListData } = useMemo(() => {
    let areas = Object.keys(AREAS) as (keyof typeof AREAS)[];
    for (let a of areas) {
      if (Object.hasOwn(entry, a)) {
        return {
          subListName: AREAS[a],
          subListData: entry[a],
        };
      }
    }
    return { subListName: null, subListData: null };
  }, [entry]);

  const handleClick = () => setOpen((open) => !open);

  if (!subListName || !subListData?.length) {
    return (
      <li>
        <span className="ml-2">{entry.name}</span>
      </li>
    );
  }

  return (
    <li>
      <span className="hover:cursor-pointer" onClick={handleClick}>
        {open ? <DownArrow /> : <RightArrow />}{" "}
        <span className="ml-2">{entry.name}</span>
      </span>
      {open ? <IndexList data={subListData} title={subListName} /> : null}
    </li>
  );
};

export default function IndeksMesta({ data }: { data?: Region[] }) {
  return (
    <div className="container mx-auto max-w-lg">
      <h1 className="mb-10 text-center font-serif text-4xl">Indeks Mesta</h1>
      <IndexList data={data} title="Regioni" />
    </div>
  );
}
