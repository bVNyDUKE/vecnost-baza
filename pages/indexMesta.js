import { useState, useCallback, useMemo } from "react";
import Icons from "../components/Icons";
import { supabase } from "../utils/supabaseClient";

export async function getServerSideProps() {
  const { data } = await supabase
    .from("region")
    .select(
      "id, name, okrug!okrug_region_id_fkey ( id, name, opstina!opstina_okrug_id_fkey (id, name, groblje!groblje_opstina_id_fkey (id, name) ) )"
    );
  return { props: { data } };
}

const indexData = { okrug: "Okruzi", opstina: "Opštine", groblje: "Groblja" };

const IndexList = ({ data, title }) => {
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

const IndexEntry = ({ entry }) => {
  const [open, setOpen] = useState(false);

  const handleClick = useCallback(() => setOpen((open) => !open), []);
  const subListName = useMemo(
    () =>
      Object.keys(entry).find((key) => Object.keys(indexData).includes(key)),
    [entry]
  );

  if (subListName) {
    return (
      <li>
        {open ? <Icons.DownArrow /> : <Icons.RightArrow />}{" "}
        <span className="ml-2 hover:cursor-pointer" onClick={handleClick}>
          {entry.name}
        </span>
        {open && (
          <div>
            {subListName && (
              <IndexList
                data={entry[subListName]}
                title={indexData[subListName]}
              />
            )}
          </div>
        )}
      </li>
    );
  }
  return <li>{entry.name}</li>;
};

export default function Entry({ data = [] }) {
  return (
    <div className="container mx-auto max-w-lg">
      <h1 className="text-center font-serif text-4xl">Index</h1>
      <IndexList data={data} title="Regioni" />
    </div>
  );
}
