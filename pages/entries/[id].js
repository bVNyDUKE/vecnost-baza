import { supabase } from "../../utils/supabaseClient";

export async function getServerSideProps(context) {
  const { id } = context.params;
  const { data } = await supabase
    .from("persons")
    .select(
      "ime, prezime, nadimak, pol, rodjenje, smrt, groblje (name, opstina (name, okrug (name, region (name ))))"
    )
    .eq("id", id);

  const result = {
    ime: data[0].ime,
    prezime: data[0].prezime,
    rodjenje: data[0].rodjenje ?? null,
    smrt: data[0].smrt ?? null,
    nadimak: data[0].nadimak ?? null,
    pol: data[0].pol ?? null,
    groblje: data[0].groblje.name,
    opstina: data[0].groblje.opstina.name,
    okrug: data[0].groblje.opstina.okrug.name,
    region: data[0].groblje.opstina.okrug.region.name,
  };

  return { props: { result } };
}

export default function Entry({ result }) {
  return (
    <div className="container mx-auto max-w-lg space-y-2 p-2 font-serif">
      <h1 className="text-2xl">
        {result.ime} {result.prezime}
      </h1>
      <div className="text-2xl">
        {result.rodjenje} - {result.smrt}
      </div>
      {result.nadimak && <div>{result.nadimak}</div>}
      <div>Pol: {result.pol}</div>
      <div>Groblje: {result.groblje}</div>
      <div>Opština: {result.opstina}</div>
      <div>Okrug: {result.okrug}</div>
      <div>Region: {result.region}</div>
    </div>
  );
}
