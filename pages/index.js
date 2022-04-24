import Section from "../components/Section";

const data = [
  {
    title: "Pretraga",
    subtitle: "U izradi",
    content: "Pretražite sahranjena lica po imenu",
    href: "/search",
    linkLabel: "Idi na pretragu",
  },
  {
    title: "Mapa",
    subtitle: "U izradi",
    content: "Pronađite arhivirane lokacija na mapi",
    href: "",
    linkLabel: "Idi na mapu",
  },
  {
    title: "Indeks",
    subtitle: "U izradi",
    content: "Indeks svih arhiviranih lokacija",
    href: "",
    linkLabel: "Idi na indeks",
  },
];

export default function Home() {
  return (
    <>
      {data.map((section, index) => (
        <Section
          key={index}
          {...section}
          color={index % 2 === 0 ? "light" : "dark"}
        />
      ))}
    </>
  );
}
