export interface SearchResult {
  id: string;
  ime: string;
  prezime: string;
  rodjenje: string;
  smrt: string;
  groblje: {
    id: string;
    name: string;
    opstina: {
      id: string;
      name: string;
      okrug: {
        id: string;
        name: string;
      };
    };
  };
}

export interface Region {
  id: string;
  name: string;
  groblje?: { id: string; name: string }[];
  opstina?: { id: string; name: string; groblje: Region["groblje"][] }[];
  okrug?: { id: string; name: string; opstina: Region["opstina"][] }[];
}

export interface IOkrug {
  path: string;
  name: string;
  id: number;
}

export interface NameStat {
  name: string;
  total: number;
  percent: number;
}

export interface LastnameStat {
  lastname: string;
  total: number;
  percent: number;
}

export interface Graveyards {
  id: number;
  name: string;
}

export interface PersonsPerOkrugStat {
  count: number;
  okrug_id: number;
  name: string;
}

export interface IGenStats {
  male: number;
  female: number;
  na: number;
}
