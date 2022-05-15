import { supabase } from "../../utils/supabaseClient";

export async function getServerSideProps(context) {
  const { id } = context.params;
  const { data } = await supabase
    .from("persons")
    .select(
      "ime, prezime, nadimak, pol, rodjenje, smrt, groblje (name), opstina (name), okrug (name), region (name)"
    )
    .eq("id", id);
  return { props: { data: data[0] } };
}

export default function Entry({ data }) {
  return (
    <div className="container mx-auto max-w-lg space-y-2 p-2 font-serif">
      <h1 className="text-2xl">
        {data.ime} {data.prezime}
      </h1>
      <div className="text-2xl">
        {data.rodjenje} - {data.smrt}
      </div>
      {data.nadimak && <div>{data.nadimak}</div>}
      <div>Pol: {data.pol}</div>
      <div>Groblje: {data.groblje.name}</div>
      <div>Opština: {data.opstina.name}</div>
      <div>Okrug: {data.okrug.name}</div>
      <div>Region: {data.region.name}</div>
    </div>
  );
}
