import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

import { OkrugGraph, RegionStatsModal } from "../components/Maps/RegionStats";
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
  name: string;
};

type QueryReturn = { data: string };

export default function Viz() {
  //prettier-ignore
  const [personsPerOkrug, setPersonsPerOkrug] = useState< PersonsPerOkrugStat[] | null>(null);
  const [selectedOkrug, setSelectedOkrug] = useState<null | Okrug>(null);
  const [nameStats, setNameStats] = useState<[] | NameStat[]>([]);
  const [grobljeStats, setGrobljStats] = useState<[] | GrobljeStat[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function getPersonsPerOkrug() {
      const { data } = await supabase.rpc<PersonsPerOkrugStat>(
        "persons_per_okrug"
      );
      console.log(data);
      setPersonsPerOkrug(data);
    }
    getPersonsPerOkrug();
  }, []);

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
      const { data } = await supabase.rpc<QueryReturn>("okrug_stats", {
        i: id,
      });
      if (data) {
        setGrobljStats(JSON.parse(data[0].data));
        setNameStats(JSON.parse(data[1].data));
      }
    }

    if (selectedOkrug?.id) {
      search(selectedOkrug.id);
    }
  }, [selectedOkrug?.id]);

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
      className="flex flex-col-reverse justify-center border-gray-200 font-serif lg:flex-row lg:justify-between"
    >
      <RegionStatsModal
        nameStats={nameStats}
        showModal={showModal}
        setShowModal={setShowModal}
        grobljeStats={grobljeStats}
        selectedOkrug={selectedOkrug}
      />
      {personsPerOkrug && <OkrugGraph personsPerOkrug={personsPerOkrug} />}
      <MapContainer
        selectedOkrugId={selectedOkrug?.id || null}
        setSelectedOkrug={setSelectedOkrug}
        setShowModal={setShowModal}
        personsPerOkrug={personsPerOkrug}
      />
    </Transition>
  );
}
