import Section from "../components/Section";
import Link from "next/link";
import Image from "next/future/image";
import img from "../public/vecna-logo-solo-100.png";

import img1 from "../public/index_1.webp";
import img2 from "../public/index_2.webp";
import img3 from "../public/index_3.webp";
import img4 from "../public/index_4.webp";

import { log } from "console";

console.log(typeof img1);

function Home() {
  const data = [
    {
      id: 1,
      imgSrc: img1,
      title: "Pretraga",
      content: "Pretražite sahranjena lica po imenu",
      href: "/pretraga",
      linkLabel: "Pretraga",
    },
    {
      id: 2,
      imgSrc: img2,
      title: "Statistika",
      content: "Interkativna statistika",
      href: "/statistika",
      linkLabel: "Statistika",
    },
    {
      id: 3,
      imgSrc: img3,
      title: "Mapa",
      content: "Pronađite arhivirane lokacija na mapi",
      href: "/mapa",
      linkLabel: "Mapa",
    },
    {
      id: 4,
      imgSrc: img4,
      title: "Indeks",
      content: "Indeks svih arhiviranih lokacija",
      href: "/indeks",
      linkLabel: "Indeks",
    },
  ];

  return (
    <>
      <div className="container mx-auto text-center">
        <Image
          src={img}
          alt="Vecnost logo"
          className="hover:pointer mx-auto object-contain"
          width={"60px"}
          height={"70px"}
          placeholder="blur"
        />
        <h1 className="mt-5 font-serif text-4xl font-bold text-secondary-dark">
          DOBRODOŠLI!
        </h1>
        <div className="mx-auto my-7 h-1.5 w-32 bg-secondary-dark"></div>
        <div className="mx-auto mb-[3.125rem] w-4/6 text-center text-lg text-[#8A8A8A]">
          Pred vama je baza podataka sahranjenih lica na teritoriji Republike
          Srbije. <span className="hidden lg:block"></span> Svi podaci su
          prikupljeni i obrađeni ručno od strane Večnosti.
        </div>
      </div>
      <div className="container mx-auto">
        <div className="flex-wrap gap-2 md:flex lg:flex-nowrap lg:gap-5 ">
          {data.map(({ id, imgSrc, title, content, href, linkLabel }) => (
            <Section
              key={id}
              imgSrc={imgSrc}
              title={title}
              content={content}
              href={href}
              linkLabel={linkLabel}
            />
          ))}
        </div>
      </div>
    </>
  );
}

Home.displayName = "Home";
export default Home;
