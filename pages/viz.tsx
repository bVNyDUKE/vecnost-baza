import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

import { OkrugGraph } from "../components/Graphs/OkrugGraph";
import { MapContainer } from "../components/Map/MapContainer";
import { SideDrawer } from "../components/SideDrawer";
import Icons from "../components/Icons";
import { NamesGraph } from "../components/Graphs/NamesGraph";
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

export type PersonsPerOkrugStat = {
  count: number;
  okrug_id: number;
  name: string;
};

export default function Viz() {
  //prettier-ignore
  const [personsPerOkrug, setPersonsPerOkrug] = useState< PersonsPerOkrugStat[] | null>(null);
  const [selectedOkrug, setSelectedOkrug] = useState<null | Okrug>(null);
  const [nameStats, setNameStats] = useState<[] | NameStat[]>([]);
  //prettier-ignore
  const [grobljeStats, setGrobljStats] = useState<[] | {grobljename: string}[]>([]);
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
      const { data } = await supabase.rpc<{ data: string }>("okrug_stats", {
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

  const statsAvailable =
    grobljeStats &&
    grobljeStats.length !== 0 &&
    nameStats &&
    nameStats.length !== 0;

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
      <SideDrawer show={showModal}>
        <div className="relative border-y py-2 ">
          <Icons.Cross
            onClick={() => setShowModal(false)}
            className="absolute top-3 right-2 h-5 w-5 border text-gray-500 shadow-sm"
          />
          <p className="text-center text-xl font-bold">Podaci okruga</p>
        </div>
        <>
          <p className="mt-4 text-center text-2xl font-bold">
            {selectedOkrug?.name}
          </p>
          {statsAvailable ? (
            <>
              <div className="sm:mt-10 md:justify-center lg:flex">
                <div className="relative h-[50vh] grow">
                  <NamesGraph nameStats={nameStats} />
                </div>
                <div className="justify-center lg:w-1/4">
                  <p className="font-bold">Groblja</p>
                  <ul className="list-disc">
                    {grobljeStats.map((graveyard, index) => (
                      //TODO add links to searches
                      <li key={index}>{graveyard.grobljename}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          ) : (
            <p className="mt-20 text-center text-3xl font-bold">
              Nema podataka za ovaj okrug
            </p>
          )}
        </>
      </SideDrawer>
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
