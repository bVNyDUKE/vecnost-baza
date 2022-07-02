import { Okrug, NameStat, GrobljeStat } from "../../pages/viz";

const GraveyardStats = ({
  graveyardStats,
}: {
  graveyardStats: GrobljeStat[];
}) => (
  <div>
    <p className="font-bold">Groblja</p>
    <ul className="list-disc">
      {graveyardStats.map((graveyard, index) => (
        //TODO add links to searches
        <li key={index}>{graveyard.grobljename}</li>
      ))}
    </ul>
  </div>
);

export const RegionStats = ({
  loading,
  selectedOkrug,
  grobljeStats,
  nameStats,
}: {
  loading: boolean;
  selectedOkrug: Okrug | null;
  grobljeStats: GrobljeStat[];
  nameStats: NameStat[];
}) => {
  return (
    <>
      <p className="text-center text-2xl font-bold">{selectedOkrug?.name}</p>
      {!loading && grobljeStats === null && nameStats === null && (
        <p className="text-center font-bold">Nema podataka za ovaj okrug</p>
      )}
      {!loading &&
        grobljeStats !== null &&
        grobljeStats?.length !== 0 &&
        nameStats !== null &&
        nameStats?.length !== 0 && (
          <div className="space-x-10 sm:mt-10 md:flex md:justify-center">
            <div>
              <p className="pl-5 font-bold">Najčešća imena</p>
              <table>
                <thead>
                  <tr>
                    <th>Ime</th>
                    <th>Ukupno</th>
                    <th>Procenat</th>
                  </tr>
                </thead>
                <tbody>
                  {nameStats.map((stat) => (
                    <tr key={stat.ime}>
                      <td>{stat.ime}</td>
                      <td>{stat.total}</td>
                      <td>{stat.percent}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <GraveyardStats graveyardStats={grobljeStats} />
          </div>
        )}
    </>
  );
};
