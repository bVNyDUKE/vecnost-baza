import Image from "next/image";

const NavBar = () => (
  <nav className="bg-white mb-10 relative w-full flex justify-center items-center after:block after:absolute after:-bottom-[2px] after:w-[70px] after:h-[5px] after:bg-[#c9c9c9]">
    <div className="w-2/3 h-32 flex justify-center items-center border-b border-[#c9c9c9]">
      <Image
        src="/vecna-logo-solo-100.png"
        alt="Vecnost logo"
        width={90}
        height={100}
        objectFit={"contain"}
      />
      <div className="font-serif text-3xl sm:text-5xl">Baza Podataka</div>
    </div>
  </nav>
);

export default NavBar;
