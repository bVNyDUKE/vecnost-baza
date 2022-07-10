import { useState, useEffect } from "react";
import {
  withPageAuth,
  supabaseClient,
} from "@supabase/supabase-auth-helpers/nextjs";
import { useUser } from "@supabase/supabase-auth-helpers/react";

import { RegionStatsModal } from "../components/Maps/RegionStats";
import { MapContainer } from "../components/Maps/MapContainer";
import { Transition } from "@headlessui/react";

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
  const [showModal, setShowModal] = useState(false);

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
    selectedOkrug && setShowModal(true);
  }, [selectedOkrug]);

  //Prevent the body from scrolling when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.removeAttribute("style");
    }
    return () => {
      document.body.removeAttribute("style");
    };
  }, [showModal]);

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
      search(selectedOkrug.id);
    }
  }, [user, selectedOkrug?.id]);

  return (
    <Transition
      appear={true}
      show={!!personsPerOkrug}
      enter="transition-opacity duration-700"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-150"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      className="flex justify-center border-gray-200 font-serif md:justify-between"
    >
      <RegionStatsModal
        nameStats={nameStats}
        showModal={showModal}
        setShowModal={setShowModal}
        grobljeStats={grobljeStats}
        selectedOkrug={selectedOkrug}
      />
      <div className="hidden w-1/2 md:block"></div>
      <MapContainer
        selectedOkrugId={selectedOkrug?.id || null}
        setSelectedOkrug={setSelectedOkrug}
        setShowModal={setShowModal}
        personsPerOkrug={personsPerOkrug}
      />
    </Transition>
  );
}
