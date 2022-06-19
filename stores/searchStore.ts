import { supabaseClient } from "@supabase/supabase-auth-helpers/nextjs";
import create from "zustand";
import uniqBy from "lodash.uniqby";

export enum Regions {
  opstina = "opstina",
  okrug = "okrug",
  groblje = "groblje",
}

export interface Option {
  name: string;
  id: string;
}

export interface Result {
  grobljeid: string;
  grobljename: string;
  opstinaid: string;
  opstinaname: string;
  okrugid: string;
  okrugname: string;
}

export interface SearchStore {
  allOptions: Result[];
  options: {
    [key in Regions]: Option[];
  };
  filter: {
    [key in Regions]: string | null;
  };
  getOptions: () => void;
  setOption: (name: keyof typeof Regions, value: string) => void;
  clearOption: (name: string) => void;
}

const generateOptions = (
  data: Result[],
  filters: { [key in Regions]?: string }
): SearchStore["options"] => {
  if (filters?.opstina && filters.opstina !== "0") {
    data = data.filter((row: Result) => row.opstinaid === filters.opstina);
  }
  if (filters?.okrug && filters.okrug !== "0") {
    data = data.filter((row: Result) => row.okrugid === filters.okrug);
  }
  if (filters?.groblje && filters.groblje !== "0") {
    data = data.filter((row: Result) => row.grobljeid === filters.groblje);
  }

  return {
    okrug: uniqBy(
      data.map((row: Result) => ({
        name: row.okrugname,
        id: row.okrugid,
      })),
      "id"
    ),
    opstina: uniqBy(
      data.map((row: Result) => ({
        name: row.opstinaname,
        id: row.opstinaid,
      })),
      "id"
    ),
    groblje: uniqBy(
      data.map((row: Result) => ({
        name: row.grobljename,
        id: row.grobljeid,
      })),
      "id"
    ),
  };
};
export const useSearchStore = create<SearchStore>((set, get) => ({
  allOptions: [],
  options: {
    okrug: [],
    opstina: [],
    groblje: [],
  },
  filter: {
    opstina: null,
    groblje: null,
    okrug: null,
  },
  getOptions: async () => {
    if (get().allOptions.length > 0) return;
    const { data } = await supabaseClient.rpc<Result>("region_data");
    const options = generateOptions(data || [], {});

    set(() => ({
      allOptions: data || [],
      options,
    }));
  },
  setOption: (name, value) => {
    const options = generateOptions(get().allOptions, { [name]: value });
    options[name] = get().options[name];
    set(() => ({ filter: { ...get().filter, [name]: value }, options }));
  },
  clearOption: (name) => {
    const options = generateOptions(get().allOptions, { [name]: "0" });
    set(() => ({ filter: { ...get().filter, [name]: null }, options }));
  },
}));
