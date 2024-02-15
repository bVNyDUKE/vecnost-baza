import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useEffect, useRef } from "react";
import { NameStat } from "../../types";

Chart.register(ChartDataLabels);

const options = {
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
    x: {
      display: true,
      stacked: false,
      grid: { display: false },
      ticks: { font: { size: 16 } },
    },
    y: {
      stacked: true,
      display: false,
    },
  },
  plugins: {
    title: {
      display: true,
      text: "Najčešća imena",
      position: "top" as "top",
      font: { weight: "bold", size: 15 },
    },
    legend: { display: false },
  },
};
export const NamesGraph = ({ nameStats }: { nameStats: NameStat[] }) => {
  const rootRef = useRef<null | HTMLCanvasElement>(null);

  useEffect(() => {
    if (!rootRef.current || !nameStats) return;
    const data = {
      labels: nameStats.map((x) => x.name),
      datasets: [
        {
          label: "Procenat",
          data: nameStats.map((x) => x.percent),
          borderColor: "white",
          datalabels: {
            display: true,
            color: "black",
            anchor: "end" as const,
            align: "top" as const,
            rotation: -90,
            formatter: function (value: string) {
              return value + "%";
            },
          },
          backgroundColor: "gray",
        },
        {
          label: "Ukupno",
          data: nameStats.map((x) => x.total),
          borderColor: "white",
          datalabels: {
            display: true,
            color: "black",
            anchor: "end" as const,
            align: "top" as const,
            font: { size: 15 },
          },
          backgroundColor: "rgb(55,65,70)",
        },
      ],
    };

    const c = new Chart(rootRef.current, {
      type: "bar",
      data,
      options,
    });

    return () => c.destroy();
  }, [nameStats]);

  return <canvas ref={rootRef} />;
};
