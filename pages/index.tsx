import Section from "../components/Section";
import Link from "next/link";
import Image from "next/image";
import Footer from "../components/Layout/Footer";

function Home() {
  const data = [
    {
      id: 1,
      title: "Pretraga",
      content: "Pretražite sahranjena lica po imenu",
      href: "/search",
      linkLabel: "Idi na pretragu",
    },
    {
      id: 2,
      title: "Statistika",
      content: "Interkativna statistika",
      href: "/statistika",
      linkLabel: "Idi na statistiku",
    },
    {
      id: 3,
      title: "Mapa",
      content: "Pronađite arhivirane lokacija na mapi",
      href: "/map",
      linkLabel: "Idi na mapu",
    },
    {
      id: 4,
      title: "Indeks",
      content: "Indeks svih arhiviranih lokacija",
      href: "/indexMesta",
      linkLabel: "Idi na indeks",
    },
  ];

  return (
    <>
      <div className="relative mb-10 flex w-full items-center justify-center bg-white after:absolute after:-bottom-[2px] after:block after:h-[5px] after:w-[70px] after:bg-[#c9c9c9]">
        <Link passHref href="/">
          <a>
            <div className="flex h-28 items-center justify-center border-b border-[#c9c9c9]">
              <Image
                src="/vecna-logo-solo-100.png"
                alt="Vecnost logo"
                className="hover:pointer"
                width={"90px"}
                height={"100px"}
                objectFit={"contain"}
                priority
              />
              <div className="font-serif text-2xl sm:text-5xl">
                Baza Podataka
              </div>
            </div>
          </a>
        </Link>
      </div>
      {data.map(({ id, title, content, href, linkLabel }) => (
        <Section
          key={id}
          title={title}
          content={content}
          href={href}
          linkLabel={linkLabel}
        />
      ))}
      <Footer />
    </>
  );
}

Home.displayName = "Home";
export default Home;
