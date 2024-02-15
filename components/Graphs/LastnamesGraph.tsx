import { Chart } from "chart.js";
import { useEffect, useRef } from "react";
import { LastnameStat } from "../../types";

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
      text: "Najčešća prezimena",
      position: "top" as "top",
      font: { weight: "bold", size: 15 },
    },
    legend: { display: false },
  },
};

export const LastnameGraph = ({
  lastnameStats,
}: {
  lastnameStats: LastnameStat[];
}) => {
  const rootRef = useRef<null | HTMLCanvasElement>(null);

  useEffect(() => {
    if (!rootRef.current || !lastnameStats) return;

    const data = {
      labels: lastnameStats.map((x) => x.lastname),
      datasets: [
        {
          label: "Procenat",
          data: lastnameStats.map((x) => x.percent),
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
          data: lastnameStats.map((x) => x.total),
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
    const c = new Chart(rootRef.current, { type: "bar", options, data });

    return () => c.destroy();
  }, [lastnameStats]);

  return <canvas ref={rootRef} />;
};
