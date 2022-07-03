import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
} from "chart.js";
import { NameStat, GrobljeStat } from "../../pages/viz";
import { useMemo } from "react";

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

const NamesGraph = ({ nameStats }: { nameStats: NameStat[] }) => {
  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);
  const labels = useMemo(() => nameStats.map((x) => x.ime), [nameStats]);
  const data = useMemo(() => {
    return {
      labels,
      datasets: [
        {
          data: nameStats.map((x) => x.total),
          borderColor: "rgb(0,0,0)",
          backgroundColor: "",
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
    scales: {
      x: { display: false },
      y: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="p-5">
      <Bar datasetIdKey="names" options={options} data={data} />
    </div>
  );
};

export const RegionStats = ({
  okrugName,
  grobljeStats,
  nameStats,
}: {
  okrugName: string;
  grobljeStats: GrobljeStat[];
  nameStats: NameStat[];
}) => {
  return (
    <>
      <p className="text-center text-2xl font-bold">{okrugName}</p>
      {grobljeStats === null && nameStats === null && (
        <p className="text-center font-bold">Nema podataka za ovaj okrug</p>
      )}
      {grobljeStats &&
        nameStats &&
        grobljeStats.length !== 0 &&
        nameStats.length !== 0 && (
          <div className="space-x-10 sm:mt-10 md:justify-center">
            <NamesGraph nameStats={nameStats} />
            <GraveyardStats graveyardStats={grobljeStats} />
          </div>
        )}
    </>
  );
};
