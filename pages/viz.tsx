import { useState, useEffect } from "react";
import {
  withPageAuth,
  supabaseClient,
} from "@supabase/supabase-auth-helpers/nextjs";
import { useUser } from "@supabase/supabase-auth-helpers/react";
import { RegionStats } from "../components/Maps/RegionStats";
import { MapContainer } from "../components/Maps/MapContainer";

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
  // prettier-ignore
  const [personsPerOkrug, setPersonsPerOkrug] = useState<PersonsPerOkrugStat[] | null>(null);
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
    <div className="mb-10 flex flex-col-reverse font-serif md:flex-row md:justify-center">
      <div className="md:w-1/2">
        {!loading && selectedOkrug !== null && (
          <RegionStats
            nameStats={nameStats}
            okrugName={selectedOkrug?.name || ""}
            grobljeStats={grobljeStats}
          />
        )}
      </div>
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
