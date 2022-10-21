import { useState } from "react";
//import Image from "next/future/image";
import Link from "next/link";
import { Transition } from "@headlessui/react";
import { Menu } from "../Icons";
import img from "../../public/vecna-logo-solo-100.png";

export default function NavBar() {
  const [showNav, setShowNav] = useState(false);

  return (
    <nav>
      <div className="mb-10 hidden bg-white sm:block drop-shadow-md">
        <div className="container sm:flex items-center justify-between mx-auto py-1.5">
          <Link passHref href="/">
            <a>
              <div className="flex items-center justify-center ">
                <img src={img.src} width="60px" alt="" />
                <div className="text-2xl sm:text-2xl font-semibold " style={{lineHeight: "0.85"}}>
                  Baza <br/> Podataka
                </div>
              </div>
            </a>
          </Link>
          <div className="flex items-center justify-between space-x-2 basis-96 text-xl font-semibold">
            <Link href="/pretraga">Pretraga</Link>
            <Link href="/statistika">Statistika</Link>
            <Link href="/indeks">Indeks</Link>
            <Link href="/mapa">Mapa</Link>
          </div>
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
}
