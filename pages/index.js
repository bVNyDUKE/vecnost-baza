import Head from "next/head";
import NavBar from "../components/NavBar";
import Section from "../components/Section";

const data = [
  {
    title: "Pretraga",
    subtitle: "U izradi",
    content: "Pretražite sahranjena lica po imenu",
    link: "Pretraga",
  },
  {
    title: "Mapa",
    subtitle: "U izradi",
    content: "Pronađite arhivirane lokacija na mapi",
    link: "",
  },
  {
    title: "Indeks",
    subtitle: "U izradi",
    content: "Indeks svih arhiviranih lokacija",
    link: "",
  },
];

export default function Home() {
  return (
    <div>
      <Head>
        <title>Vecnost - Baza</title>
      </Head>
      <NavBar />
      <main>
        {data.map((section, index) => (
          <Section
            key={index}
            {...section}
            color={index % 2 === 0 ? "light" : "dark"}
          />
        ))}
      </main>
    </div>
  );
}
