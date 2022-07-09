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
    responsive: true,
    maintainAspectRatio: false,
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
      className="h-full overflow-scroll py-2"
    >
      {grobljeStats === null && nameStats === null && (
        <p className="text-center font-bold">Nema podataka za ovaj okrug</p>
      )}
      {grobljeStats &&
        nameStats &&
        grobljeStats.length !== 0 &&
        nameStats.length !== 0 && (
          <div className="sm:mt-10 md:justify-center lg:flex">
            <div className="h-[50vh] grow p-1">
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
      className="fixed top-5 bottom-5 left-0 right-5 z-50 w-full overflow-scroll rounded-lg border-t bg-white text-gray-700 drop-shadow-lg"
      enter="transition delay-150 duration-500 ease-in-out"
      enterFrom="-translate-x-full"
      enterTo="translate-x-0"
      leave="transition duration-500 delay-150 ease-in-out"
      leaveFrom="translate-x-0"
      leaveTo="-translate-x-full"
    >
      <div
        className="flex items-center justify-center pt-1"
        onClick={() => setShowModal(false)}
      >
        <div className="flex grow justify-end">
          <p className="text-2xl font-bold">{selectedOkrug?.name || ""}</p>
        </div>
        <div className="flex w-1/3 justify-end">
          <Icons.Cross className="mr-3 h-5 w-5 border text-gray-500 shadow-sm" />
        </div>
      </div>
      <RegionStats nameStats={nameStats} grobljeStats={grobljeStats} />
    </Transition>
  );
};
