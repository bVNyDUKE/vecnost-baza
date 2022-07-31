import { useMemo } from "react";
import { Pie } from "react-chartjs-2";
import { PersonsPerOkrugStat } from "../../pages/viz";

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
          data: personsPerOkrug.map((x) => x.count),
          backgroundColor: ["#E7D2CC", "#b9b7bd", "#868b8e", "#eeede7"],
        },
      ],
    };
  }, [labels, personsPerOkrug]);

  const options = {
    normalized: true,
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Broj lica po okrugu",
        position: "top" as "top",
        font: { weight: "bold", size: 20 },
      },
      datalabels: {
        labels: {},
        display: true,
        color: "black",
        anchor: "end" as const,
        align: "end" as const,
      },
    },
  };

  return <Pie datasetIdKey="okrug" options={options} data={data} />;
};
