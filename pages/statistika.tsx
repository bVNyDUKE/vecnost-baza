import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

import { MapContainer } from "../components/Map/MapContainer";
import { SideDrawer } from "../components/SideDrawer";
import Icons from "../components/Icons";
import {
  NamesGraph,
  OkrugGraph,
  LastnameGraph,
  GenGraph,
} from "../components/Graphs";
import { Transition } from "@headlessui/react";
import Link from "next/link";

export type Okrug = {
  path: string;
  name: string;
  id: number;
};

export type NameStat = {
  name: string;
  total: number;
  percent: number;
};

export type LastnameStat = {
  lastname: string;
  total: number;
  percent: number;
};

export type Graveyards = {
  id: number;
  name: string;
};

export type PersonsPerOkrugStat = {
  count: number;
  okrug_id: number;
  name: string;
};

export interface IGenStats {
  male: number;
  female: number;
  na: number;
}

export async function getStaticProps() {
  const [{ data: personsPerOkrug }, { data: genData }] = await Promise.all([
    supabase.rpc<PersonsPerOkrugStat>("persons_per_okrug"),
    supabase.rpc<IGenStats>("gender_dist"),
  ]);

  return { props: { personsPerOkrug, genData }, revalidate: 60 * 60 * 24 };
}

export default function Viz({
  personsPerOkrug,
  genData,
}: {
  personsPerOkrug: PersonsPerOkrugStat[] | null;
  genData: IGenStats[] | null;
}) {
  const [selectedOkrug, setSelectedOkrug] = useState<null | Okrug>(null);
  const [nameStats, setNameStats] = useState<[] | NameStat[]>([]);
  const [lastnameStats, setLastnameStats] = useState<[] | LastnameStat[]>([]);
  const [grobljeStats, setGrobljStats] = useState<[] | Graveyards[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [startTransition, setStartTransition] = useState(false);

  useEffect(() => setStartTransition(true), []);

  useEffect(() => {
    async function getOkrugData(okrugid: number) {
      const [
        { data: graveyardData },
        { data: nameData },
        { data: lastnameData },
      ] = await Promise.all([
        await supabase.rpc<Graveyards>("graveyards_per_okrug", { okrugid }),
        await supabase.rpc<NameStat>("top_names", {
          okrugid,
        }),
        await supabase.rpc<LastnameStat>("top_lastnames", {
          okrugid,
        }),
      ]);

      graveyardData && setGrobljStats(graveyardData);
      nameData && setNameStats(nameData);
      lastnameData && setLastnameStats(lastnameData);
    }

    selectedOkrug?.id && getOkrugData(selectedOkrug.id);
    selectedOkrug?.id && setShowModal(true);
  }, [selectedOkrug?.id]);

  const statsAvailable =
    grobljeStats &&
    grobljeStats.length !== 0 &&
    nameStats &&
    nameStats.length !== 0;

  return (
    <Transition
      appear={true}
      show={startTransition}
      enter="transition-opacity duration-700"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-150"
      leaveFrom="opacity-100"
      leaveTo="opacity-0 "
      className="flex flex-col-reverse justify-center border-gray-200 font-serif lg:flex-row lg:justify-center"
    >
      <SideDrawer show={showModal}>
        <div className="absolute z-10 w-full border-y bg-white py-2">
          <Icons.Cross
            onClick={() => setShowModal(false)}
            className="absolute top-3 right-2 h-5 w-5 border text-gray-500 shadow-sm"
          />
          <p className="text-center text-xl font-bold">Podaci okruga</p>
        </div>
        <div className="mt-14">
          <p className="mt-4 text-center text-2xl font-bold">
            {selectedOkrug?.name}
          </p>
          {statsAvailable ? (
            <>
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
                          <a>{graveyard.name}</a>
                        </li>
                      </Link>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          ) : (
            <div className="mt-20 flex items-center justify-center">
              <Icons.Spinner height="h-20" width="w-20" />
            </div>
          )}
        </div>
      </SideDrawer>
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
        setSelectedOkrug={setSelectedOkrug}
        setShowModal={setShowModal}
        personsPerOkrug={personsPerOkrug}
      />
    </Transition>
  );
}
