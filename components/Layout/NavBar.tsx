import { useState } from "react";
import Image from "next/future/image";
import Link from "next/link";
import { Transition } from "@headlessui/react";
import { Menu, Cross } from "../Icons";
import img from "../../public/vecna-logo-solo-100.png";

export default function NavBar() {
  const [showNav, setShowNav] = useState(false);

  return (
    <nav>
      <div className="mb-10 hidden bg-white drop-shadow-md sm:block">
        <div className="container mx-auto items-center justify-between py-1.5 sm:flex">
          <Link passHref href="/">
            <a>
              <div className="flex items-center justify-center ">
                <Image
                  src={img}
                  alt="Vecnost logo"
                  className="hover:pointer object-contain"
                  placeholder="blur"
                  style={{ width: "60px" }}
                />
                <div
                  className="text-2xl font-semibold sm:text-2xl "
                  style={{ lineHeight: "0.85" }}
                >
                  Baza <br /> Podataka
                </div>
              </div>
            </a>
          </Link>
          <div className="flex basis-96 items-center justify-between space-x-2 text-xl font-semibold">
            <Link href="/pretraga">Pretraga</Link>
            <Link href="/statistika">Statistika</Link>
            <Link href="/indeks">Indeks</Link>
            <Link href="/mapa">Mapa</Link>
          </div>
        </div>
      </div>

      <div className="mb-2 flex items-center text-gray-500 sm:hidden">
        <button onClick={() => setShowNav(!showNav)}>
          {showNav === true ? <Cross className="h-10 w-10" /> : <Menu />}
        </button>
        <Transition
          show={showNav}
          enter="transition-opacity duration-700"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-700"
          leaveFrom="opacity-100"
          leaveTo="opacity-0 "
          className="mx-auto w-full items-center justify-between space-x-2 px-2 font-bold"
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
