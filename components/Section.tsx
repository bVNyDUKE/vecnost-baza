import React, { useState } from "react";
import Button from "./Button";
import Image from "next/future/image";

export default function Section({
  imgSrc,
  title,
  content,
  href,
  linkLabel,
}: {
  imgSrc: string;
  title: string;
  content: React.ReactNode;
  href: string;
  linkLabel: string;
}) {
  const [isShown, setIsShown] = useState(false);
  return (
    <div
      className="group mx-auto mb-10 max-w-sm md:w-3/6 lg:mb-0 lg:w-3/12"
      /*style={{ backgroundImage: `url(${imgSrc})` }}*/
      onMouseEnter={() => setIsShown(true)}
      onMouseLeave={() => setIsShown(false)}
    >
      <section className="relative flex h-64 flex-col overflow-hidden md:h-[240px] xl:h-[350px]">
        <Image
          src={imgSrc}
          alt="image"
          className="t-0 l-0 z-05 absolute w-full object-cover"
          width={"305"}
          height={"384"}
        />
        <div
          className={`align-center visible z-10 flex grow flex-col justify-center p-5 transition delay-150 ease-in-out ${
            isShown == true ? "md:visible" : "md:invisible"
          }`}
        >
          <div className="text-center text-white">
            <div className="mx-auto w-48 text-center text-lg font-semibold md:text-xl">
              {content}
            </div>
            <div className="mt-5 text-sm">
              <Button label={linkLabel} href={href} />
            </div>
          </div>
        </div>
        <div className="z-10 hidden py-5 md:block">
          <div className="font-bold">
            <h2 className="text-center font-serif font-semibold uppercase text-white md:text-2xl">
              {title}
            </h2>
          </div>
        </div>
        <div
          className={`absolute bottom-0 w-full bg-gradient-to-t from-[#000] ${
            isShown == true ? "h-full" : "h-36"
          }`}
        />
      </section>
    </div>
  );
}
