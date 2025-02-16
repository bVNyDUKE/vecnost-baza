import { useMemo } from "react";
import { supabase } from "../lib/supabaseClient";
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
      <div className="mt-2 ml-7 list-inside">
        {data &&
          data.map((entry) => <IndexEntry key={entry.id} entry={entry} />)}
      </div>
    </div>
  );
};

let AREAS = {
  okrug: "Okruzi",
  opstina: "Opštine",
  groblje: "Groblja",
} as const;

const IndexEntry = ({ entry }: { entry: Region }) => {
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

  if (!subListName || !subListData?.length) {
    return <p className="ml-5 text-lg">{entry.name}</p>;
  }

  return (
    <details>
      <summary className="cursor-pointer text-lg before:mr-[5px]">
        {entry.name}
      </summary>
      <IndexList data={subListData} title={subListName} />
    </details>
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
