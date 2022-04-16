import { supabase } from "../../utils/supabaseClient";

export async function getServerSideProps(context){
    const {id} = context.params
    const {data} = await supabase.from('persons').select().eq('id', id)
    return {props: { data: data[0] }}
}

export default function Entry({data}){

  return (
    <div>
      <h1>{data.ime}</h1>
      <p>{data.prezime}</p>
    </div>
  )

}