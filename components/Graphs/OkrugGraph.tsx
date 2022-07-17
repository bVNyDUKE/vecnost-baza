import { useMemo } from "react";

import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  ArcElement,
  Tooltip,
} from "chart.js";
import { PersonsPerOkrugStat } from "../../pages/viz";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  ChartDataLabels,
  ArcElement
);

export const OkrugGraph = ({
  personsPerOkrug,
}: {
  personsPerOkrug: PersonsPerOkrugStat[];
}) => {
  const labels = useMemo(
    () => personsPerOkrug.map((x) => x.name),
    [personsPerOkrug]
  );
  const data = useMemo(() => {
    return {
      labels,
      datasets: [
        {
          label: "Ime okruga",
          data: personsPerOkrug.map((x) => x.count),
          backgroundColor: ["#E7D2CC", "#b9b7bd", "#868b8e", "#eeede7"],
        },
      ],
    };
  }, [labels, personsPerOkrug]);

  const options = {
    normalized: true,
    plugins: {
      title: {
        display: true,
        text: "Broj lica po okrugu",
        position: "top" as "top",
      },
    },
  };

  return (
    <div className="lg:w-1/2">
      <Doughnut datasetIdKey="names" options={options} data={data} />
    </div>
  );
};
