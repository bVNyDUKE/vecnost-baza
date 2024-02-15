import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useEffect, useRef } from "react";
import { IGenStats } from "../../types";

Chart.register(ChartDataLabels);

const options = {
  normalized: true,
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: "Polovi",
      position: "top" as const,
      font: { size: 25, family: "Playfair" },
      color: "Black",
    },
    datalabels: {
      display: true,
      anchor: "center" as const,
      formatter: function (value: string) {
        return value + "%";
      },
    },
  },
};

export const GenGraph = ({ genStats }: { genStats: IGenStats[] | null }) => {
  const rootRef = useRef<null | HTMLCanvasElement>(null);

  useEffect(() => {
    const data = {
      labels: ["muski", "zenski", "nepoznato"],
      datasets: [
        {
          data: genStats
            ? [genStats[0].male, genStats[0].female, genStats[0].na]
            : [],
          backgroundColor: ["#E7D2CC", "#b9b7bd", "#868b8e", "#eeede7"],
        },
      ],
    };

    if (!rootRef.current) return;

    const c = new Chart(rootRef.current, { type: "pie", data, options });

    return () => {
      c.destroy();
    };
  }, [genStats]);

  return <canvas ref={rootRef}></canvas>;
};
