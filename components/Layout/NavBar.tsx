import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Transition } from "@headlessui/react";
import { Menu } from "../Icons";

const NavBar = () => {
  const [showNav, setShowNav] = useState(false);

  return (
    <nav>
      <div className="relative mx-auto mb-10 hidden w-[90%] items-center justify-between border-b border-[#c9c9c9] bg-white after:absolute after:-bottom-[2px] after:left-[45%] after:h-[5px] after:w-[200px] after:bg-[#c9c9c9] after:text-center sm:flex">
        <Link passHref href="/">
          <a>
            <div className="flex items-center justify-center ">
              <Image
                src="/vecna-logo-solo-100.png"
                alt="Vecnost logo"
                className="hover:pointer"
                width={"60px"}
                height={"70px"}
                objectFit={"contain"}
                priority
              />
              <div className="font-serif text-2xl sm:text-3xl">
                Baza Podataka
              </div>
            </div>
          </a>
        </Link>
        <div className="flex items-center justify-between space-x-2">
          <Link href="/">Početna</Link>
          <Link href="/pretraga">Pretraga</Link>
          <Link href="/statistika">Statistika</Link>
          <Link href="/indeks">Indeks</Link>
          <Link href="/mapa">Mapa</Link>
        </div>
      </div>

      <div className="mb-2 flex text-gray-500 sm:hidden">
        <button onClick={() => setShowNav(!showNav)}>
          <Menu />
        </button>
        <Transition
          show={showNav}
          enter="transition-opacity duration-700"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-700"
          leaveFrom="opacity-100"
          leaveTo="opacity-0 "
          className="mx-auto flex w-full items-center justify-between space-x-2 px-2 font-bold"
        >
          <Link href="/">Početna</Link>
          <Link href="/pretraga">Pretraga</Link>
          <Link href="/statistika">Statistika</Link>
          <Link href="/indeks">Indeks</Link>
          <Link href="/mapa">Mapa</Link>
        </Transition>
      </div>
    </nav>
  );
};

export default NavBar;
