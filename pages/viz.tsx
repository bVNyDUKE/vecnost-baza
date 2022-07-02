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

type QueryReturn = { data: string };

export const getServerSideProps = withPageAuth();

export default function Viz() {
  const { user } = useUser();
  const [selectedOkrug, setSelectedOkrug] = useState<null | Okrug>(null);
  const [nameStats, setNameStats] = useState<[] | NameStat[]>([]);
  const [grobljeStats, setGrobljStats] = useState<[] | GrobljeStat[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function search(id: number) {
      const res = await supabaseClient.rpc<QueryReturn>("okrug_stats", {
        i: id,
      });
      const data = res.data as QueryReturn[];
      setGrobljStats(JSON.parse(data[0].data));
      setNameStats(JSON.parse(data[1].data));
    }

    if (user && selectedOkrug?.id) {
      setLoading(true);
      search(selectedOkrug.id);
      setLoading(false);
    }
  }, [user, selectedOkrug?.id]);

  return (
    <div className="mb-10 flex flex-col-reverse font-serif sm:flex-row sm:items-center sm:justify-center">
      <div className="sm:w-1/2">
        <RegionStats
          nameStats={nameStats}
          selectedOkrug={selectedOkrug}
          grobljeStats={grobljeStats}
          loading={loading}
        />
      </div>
      <div className="relative sm:w-1/2">
        <MapContainer
          selectedOkrug={selectedOkrug}
          setSelectedOkrug={setSelectedOkrug}
        />
      </div>
    </div>
  );
}
