import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  BarElement,
  Tooltip,
  ArcElement,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  CategoryScale,
  Tooltip,
  LinearScale,
  Title,
  Tooltip,
  ChartDataLabels,
  BarElement,
  ArcElement
);

export * from "./NamesGraph";
export * from "./LastnamesGraph";
export * from "./OkrugGraph";
