import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { NameStat, GrobljeStat, Okrug } from "../../pages/viz";
import { Dispatch, SetStateAction, useMemo } from "react";
import { Transition } from "@headlessui/react";
import Icons from "../Icons";

const GraveyardStats = ({
  graveyardStats,
}: {
  graveyardStats: GrobljeStat[];
}) => (
  <div>
    <p className="font-bold">Groblja</p>
    <ul className="list-disc">
      {graveyardStats.map((graveyard, index) => (
        //TODO add links to searches
        <li key={index}>{graveyard.grobljename}</li>
      ))}
    </ul>
  </div>
);

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartDataLabels
);

const NamesGraph = ({ nameStats }: { nameStats: NameStat[] }) => {
  const labels = useMemo(() => nameStats.map((x) => x.ime), [nameStats]);
  const data = useMemo(() => {
    return {
      labels,
      datasets: [
        {
          data: nameStats.map((x) => x.total),
          borderColor: "white",
          datalabels: {
            display: true,
            color: "white",
            anchor: "end" as const,
            align: "left" as const,
            font: { size: 15 },
          },
          backgroundColor: "rgb(55,65,70)",
        },
        {
          data: nameStats.map((x) => x.percent),
          borderColor: "white",
          datalabels: {
            display: true,
            color: "black",
            anchor: "end" as const,
            align: "right" as const,
            formatter: function (value: string) {
              return value + "%";
            },
          },
          backgroundColor: "rgb(55,65,70)",
        },
      ],
    };
  }, [labels, nameStats]);

  const options = {
    indexAxis: "y" as const,
    elements: {
      bar: { borderWidth: 1 },
    },
    normalized: true,
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        right: 30,
        left: 10,
      },
    },
    scales: {
      x: { display: false },
      y: {
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      title: {
        display: true,
        text: "Najčešća imena",
        position: "top" as "top",
      },
    },
  };

  return (
    <Bar
      datasetIdKey="names"
      options={options}
      data={data}
      plugins={[ChartDataLabels]}
    />
  );
};

const RegionStats = ({
  grobljeStats,
  nameStats,
}: {
  grobljeStats: GrobljeStat[];
  nameStats: NameStat[];
}) => {
  return (
    <Transition.Child
      enter="transition-opacity duration-700"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-700"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      className="h-[84vh] overflow-auto py-2 shadow-md"
    >
      {grobljeStats === null && nameStats === null && (
        <p className="text-center font-bold">Nema podataka za ovaj okrug</p>
      )}
      {grobljeStats &&
        nameStats &&
        grobljeStats.length !== 0 &&
        nameStats.length !== 0 && (
          <div className="sm:mt-10 md:justify-center lg:flex">
            <div className="relative h-[50vh] grow">
              <NamesGraph nameStats={nameStats} />
            </div>
            <div className="flex justify-center lg:w-1/4">
              <GraveyardStats graveyardStats={grobljeStats} />
            </div>
          </div>
        )}
    </Transition.Child>
  );
};

export const RegionStatsModal = ({
  selectedOkrug,
  nameStats,
  grobljeStats,
  showModal,
  setShowModal,
}: {
  selectedOkrug: Okrug | null;
  nameStats: NameStat[];
  grobljeStats: GrobljeStat[];
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <Transition
      show={showModal}
      className="top-15 fixed bottom-5 left-0 right-5 z-50 h-[90vh] w-full rounded-lg bg-white text-gray-700"
      enter="transition delay-150 duration-500 ease-in-out"
      enterFrom="-translate-x-full"
      enterTo="translate-x-0"
      leave="transition duration-500 delay-150 ease-in-out"
      leaveFrom="translate-x-0"
      leaveTo="-translate-x-full"
    >
      <div className="relative border-y py-2 ">
        <Icons.Cross
          onClick={() => setShowModal(false)}
          className="absolute top-3 right-2 h-5 w-5 border text-gray-500 shadow-sm"
        />
        <p className="text-center text-2xl font-bold">
          {selectedOkrug?.name || ""}
        </p>
      </div>
      <RegionStats nameStats={nameStats} grobljeStats={grobljeStats} />
    </Transition>
  );
};
