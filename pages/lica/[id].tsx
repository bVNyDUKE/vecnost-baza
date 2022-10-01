import { GetServerSideProps } from "next";
import { supabase } from "../../lib/supabaseClient";
import { IPerson } from "../../types";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const id = ctx.params?.id as string;
  const { data } = await supabase
    .from<IPerson>("persons")
    .select(
      "ime, prezime, nadimak, pol, rodjenje, smrt, groblje (name, opstina (name, okrug (name, region (name ))))"
    )
    .eq("id", id);

  if (!data) {
    return {
      notFound: true,
    };
  }

  return { props: { result: data[0] } };
};

export default function Entry({ result }: { result: IPerson }) {
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
      <div>Groblje: {result.groblje.name}</div>
      <div>Opština: {result.groblje.opstina.name}</div>
      <div>Okrug: {result.groblje.opstina.okrug.name}</div>
      <div>Region: {result.groblje.opstina.okrug.region.name}</div>
    </div>
  );
}
