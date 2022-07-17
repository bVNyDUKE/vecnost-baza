import { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  BarElement,
  Tooltip,
} from "chart.js";
import { NameStat } from "../../pages/viz";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  ChartDataLabels,
  BarElement
);

export const NamesGraph = ({ nameStats }: { nameStats: NameStat[] }) => {
  const labels = useMemo(() => nameStats.map((x) => x.ime), [nameStats]);
  const data = useMemo(() => {
    return {
      labels,
      datasets: [
        {
          data: nameStats.map((x) => x.percent),
          borderColor: "white",
          datalabels: {
            display: true,
            color: "white",
            anchor: "end" as const,
            align: "right" as const,
            formatter: function (value: string) {
              return value + "%";
            },
          },
          backgroundColor: "gray",
        },
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
      x: { display: false, stacked: true },
      y: {
        stacked: true,
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
