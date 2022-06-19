import Section from "../components/Section";
import { withPageAuth } from "@supabase/supabase-auth-helpers/nextjs";

export const getServerSideProps = withPageAuth({ redirectTo: "/login" });

export default function Home() {
  const data = [
    {
      id: 1,
      title: "Pretraga",
      subtitle: "U izradi",
      content: "Pretražite sahranjena lica po imenu",
      href: "/search",
      linkLabel: "Idi na pretragu",
    },
    {
      id: 2,
      title: "Mapa",
      subtitle: "U izradi",
      content: "Pronađite arhivirane lokacija na mapi",
      href: "/", //need to prefix this to avoid server/client mismatch
      linkLabel: "U izradi",
    },
    {
      id: 3,
      title: "Indeks",
      subtitle: "U izradi",
      content: "Indeks svih arhiviranih lokacija",
      href: "/indexMesta",
      linkLabel: "Idi na indeks",
    },
  ];

  return (
    <>
      {data.map(({ id, title, subtitle, content, href, linkLabel }) => (
        <Section
          key={id}
          title={title}
          subtitle={subtitle}
          content={content}
          href={href}
          linkLabel={linkLabel}
        />
      ))}
    </>
  );
}
