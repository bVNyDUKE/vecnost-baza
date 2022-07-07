import { useState, useEffect } from "react";
import {
  withPageAuth,
  supabaseClient,
} from "@supabase/supabase-auth-helpers/nextjs";
import { useUser } from "@supabase/supabase-auth-helpers/react";
import { RegionStats } from "../components/Maps/RegionStats";
import { MapContainer } from "../components/Maps/MapContainer";
import Icons from "../components/Icons";

export type Okrug = {
  path: string;
  name: string;
  id: number;
};

export type NameStat = {
  ime: string;
  total: number;
  percent: number;
};

export type GrobljeStat = {
  grobljename: string;
};

export type PersonsPerOkrugStat = {
  count: number;
  okrug_id: number;
};

type QueryReturn = { data: string };

export const getServerSideProps = withPageAuth();

export default function Viz() {
  const { user } = useUser();
  //prettier-ignore
  const [personsPerOkrug, setPersonsPerOkrug] = useState< PersonsPerOkrugStat[] | null>(null);
  const [selectedOkrug, setSelectedOkrug] = useState<null | Okrug>(null);
  const [nameStats, setNameStats] = useState<[] | NameStat[]>([]);
  const [grobljeStats, setGrobljStats] = useState<[] | GrobljeStat[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getPersonsPerOkrug() {
      const { data } = await supabaseClient.rpc<PersonsPerOkrugStat>(
        "persons_per_okrug"
      );
      console.log(data);
      setPersonsPerOkrug(data);
    }
    if (user) {
      getPersonsPerOkrug();
    }
  }, [user]);

  useEffect(() => {
    async function search(id: number) {
      setLoading(true);
      const res = await supabaseClient.rpc<QueryReturn>("okrug_stats", {
        i: id,
      });
      const data = res.data as QueryReturn[];
      setGrobljStats(JSON.parse(data[0].data));
      setNameStats(JSON.parse(data[1].data));
      setLoading(false);
    }

    if (user && selectedOkrug?.id) {
      search(selectedOkrug.id);
    }
  }, [user, selectedOkrug?.id]);

  return (
    <div className="relative mb-10 flex flex-col-reverse overflow-hidden border-gray-200 font-serif md:flex-row md:justify-center">
      <div
        className={`absolute top-0 left-full z-50 h-[100vh] w-full border-t border-gray-600 bg-white transition delay-150 duration-500 ease-in-out ${
          selectedOkrug ? "-translate-x-full" : ""
        }`}
      >
        <div
          className="relative top-2 left-2"
          onClick={() => setSelectedOkrug(null)}
        >
          <Icons.Cross />
        </div>
        {!loading && selectedOkrug !== null && (
          <RegionStats
            nameStats={nameStats}
            okrugName={selectedOkrug?.name || ""}
            grobljeStats={grobljeStats}
          />
        )}
      </div>
      <div className="md:w-1/2"></div>
      <div className="relative md:w-1/2">
        <MapContainer
          selectedOkrugId={selectedOkrug?.id || null}
          setSelectedOkrug={setSelectedOkrug}
          personsPerOkrug={personsPerOkrug}
        />
      </div>
    </div>
  );
}
