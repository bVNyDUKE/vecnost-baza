import { Chart } from "chart.js";
import { useEffect, useRef } from "react";
import { PersonsPerOkrugStat } from "../../types";

const options = {
  normalized: true,
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: "Broj lica po okrugu",
      position: "top" as const,
      font: { size: 25, family: "Playfair" },
      color: "Black",
    },
    datalabels: {
      display: true,
      anchor: "end" as const,
      align: "end" as const,
      offset: -7,
    },
  },
};

export const OkrugGraph = ({
  personsPerOkrug,
}: {
  personsPerOkrug: PersonsPerOkrugStat[] | null;
}) => {
  const rootRef = useRef<null | HTMLCanvasElement>(null);

  useEffect(() => {
    if (!rootRef.current || !personsPerOkrug) return;

    const data = {
      labels: personsPerOkrug.map((x) => x.name),
      datasets: [
        {
          data: personsPerOkrug.map((x) => x.count),
          backgroundColor: ["#E7D2CC", "#b9b7bd", "#868b8e", "#eeede7"],
        },
      ],
    };

    const c = new Chart(rootRef.current, { type: "pie", data, options });

    return () => c.destroy();
  }, [personsPerOkrug]);

  return <canvas ref={rootRef}></canvas>;
};
