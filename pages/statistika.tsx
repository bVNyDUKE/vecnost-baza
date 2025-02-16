import { useState, useEffect, useCallback } from "react";
import { Transition } from "@headlessui/react";
import { supabase } from "../lib/supabaseClient";
import Link from "next/link";
import {
  PersonsPerOkrugStat,
  IGenStats,
  NameStat,
  IOkrug,
  LastnameStat,
  Graveyards,
} from "../types";
import { GenGraph } from "../components/Graphs/GenGraph";
import { OkrugGraph } from "../components/Graphs/OkrugGraph";
import { NamesGraph } from "../components/Graphs/NamesGraph";
import { LastnameGraph } from "../components/Graphs/LastnamesGraph";
import Icons from "../components/Icons";
import MapContainer from "../components/Map/MapContainer";
import SideDrawer from "../components/SideDrawer";
import { useHashModal } from "../hooks/useHashModal";

export async function getStaticProps() {
  const [{ data: personsPerOkrug }, { data: genData }] = await Promise.all([
    supabase.rpc<PersonsPerOkrugStat>("persons_per_okrug"),
    supabase.rpc<IGenStats>("gender_dist"),
  ]);

  return { props: { personsPerOkrug, genData }, revalidate: 60 * 60 * 24 };
}

export default function Statistika({
  personsPerOkrug,
  genData,
}: {
  personsPerOkrug: PersonsPerOkrugStat[] | null;
  genData: IGenStats[] | null;
}) {
  const [selectedOkrug, setSelectedOkrug] = useState<null | IOkrug>(null);
  const [nameStats, setNameStats] = useState<[] | NameStat[]>([]);
  const [lastnameStats, setLastnameStats] = useState<[] | LastnameStat[]>([]);
  const [grobljeStats, setGrobljeStats] = useState<[] | Graveyards[]>([]);
  const { isOpen, openModal, closeModal, toggleModal } = useHashModal();
  const [startTransition, setStartTransition] = useState(false);

  const getOkrugData = useCallback(async (okrugid: number) => {
    const [
      { data: graveyardData },
      { data: nameData },
      { data: lastnameData },
    ] = await Promise.all([
      supabase.rpc<Graveyards>("graveyards_per_okrug", { okrugid }),
      supabase.rpc<NameStat>("top_names", {
        okrugid,
      }),
      supabase.rpc<LastnameStat>("top_lastnames", {
        okrugid,
      }),
    ]);
    if (graveyardData) {
      setGrobljeStats(graveyardData);
    }

    if (nameData) {
      setNameStats(nameData);
    }

    if (lastnameData) {
      setLastnameStats(lastnameData);
    }
  }, []);

  useEffect(() => setStartTransition(true), []);

  useEffect(() => {
    if (selectedOkrug?.id) {
      getOkrugData(selectedOkrug.id);
      openModal();
    }
  }, [openModal, getOkrugData, selectedOkrug?.id]);

  const handleMapClick = (okrug: IOkrug) => {
    if (selectedOkrug?.id === okrug.id) {
      toggleModal();
    } else {
      setSelectedOkrug(okrug);
    }
  };

  const statsAvailable =
    grobljeStats &&
    grobljeStats.length !== 0 &&
    nameStats &&
    nameStats.length !== 0;

  return (
    <>
      <Transition
        appear={true}
        show={startTransition}
        enter="transition-opacity duration-700"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="flex flex-col-reverse justify-center border-gray-200 font-serif lg:flex-row lg:justify-center">
          <div className="mx-auto my-10 h-1/2 max-w-xl space-y-5 lg:my-0 lg:mx-0 lg:mb-10 lg:h-full lg:w-1/2">
            <div className="relative h-1/2 w-[100vw] sm:w-full">
              <OkrugGraph personsPerOkrug={personsPerOkrug} />
            </div>
            <div className="relative h-1/2 w-[100vw] sm:w-full">
              <GenGraph genStats={genData} />
            </div>
          </div>
          <MapContainer
            selectedOkrugId={selectedOkrug?.id || null}
            handleMapClick={handleMapClick}
            personsPerOkrug={personsPerOkrug}
          />
        </div>
      </Transition>
      <SideDrawer show={isOpen}>
        <div className="absolute z-10 w-full border-y bg-white py-2">
          <Icons.Cross
            onClick={closeModal}
            className="absolute top-3 right-2 h-5 w-5 border text-gray-500 shadow-xs"
          />
          <p className="text-center text-xl font-bold">Podaci okruga</p>
        </div>
        <div className="mt-14">
          <p className="mt-4 text-center text-2xl font-bold">
            {selectedOkrug?.name}
          </p>
          {statsAvailable ? (
            <div className="sm:mt-10">
              <div className="relative h-[25vh]">
                <NamesGraph nameStats={nameStats} />
              </div>
              <div className="relative mt-10 h-[25vh]">
                <LastnameGraph lastnameStats={lastnameStats} />
              </div>
              <div className="justify-center p-10">
                <p className="mb-5 text-2xl font-bold">Groblja</p>
                <ul className="box-border space-y-1">
                  {grobljeStats.map((graveyard) => (
                    <Link
                      key={graveyard.id}
                      href={`/pretraga?groblje=${graveyard.id}`}
                      passHref
                    >
                      <li className="box-border border p-8 hover:cursor-pointer hover:shadow-md">
                        {graveyard.name}
                      </li>
                    </Link>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="mt-20 flex items-center justify-center">
              <Icons.Spinner height="h-20" width="w-20" />
            </div>
          )}
        </div>
      </SideDrawer>
    </>
  );
}
