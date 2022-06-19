import Image from "next/image";
import Link from "next/link";

const NavBar = () => (
  <nav className="relative mb-10 flex w-full items-center justify-center bg-white after:absolute after:-bottom-[2px] after:block after:h-[5px] after:w-[70px] after:bg-[#c9c9c9]">
    <Link passHref href="/">
      <a>
        <div className="flex h-32 items-center justify-center border-b border-[#c9c9c9]">
          <Image
            src="/vecna-logo-solo-100.png"
            alt="Vecnost logo"
            className="hover:pointer"
            width={"90px"}
            height={"100px"}
            objectFit={"contain"}
            priority
          />
          <div className="font-serif text-3xl sm:text-5xl">Baza Podataka</div>
        </div>
      </a>
    </Link>
  </nav>
);

export default NavBar;
