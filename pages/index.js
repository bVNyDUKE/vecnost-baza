import Head from "next/head";
import NavBar from "../components/NavBar";
import Section from "../components/Section";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Vecnost - Baza</title>
      </Head>
      <NavBar />
      <main>
        <Section title="Mapa" subtitle="U izradi">
          <h2>Mapa</h2>
        </Section>
        <Section title="Pretraga" subtitle="U izradi">
          <h2>Mapa</h2>
        </Section>
        <Section title="Indeks" subtitle="U izradi" />
      </main>
    </div>
  );
}
