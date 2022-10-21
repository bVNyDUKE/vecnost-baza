import React, { useState } from 'react';
import Button from "./Button";


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

  const display = (isShown == true) ? 'visible' : 'hidden';
  const height = (isShown == true) ? '100%' : '200px';

  return (
    <div 
      className="group md:w-3/6 lg:w-3/12 max-w-sm mx-auto mb-10 lg:mb-0" 
      style={{backgroundImage: `url(${imgSrc})`}} 
      onMouseEnter={() => setIsShown(true)} 
      onMouseLeave={() => setIsShown(false)}
    >
      <section className="h-64 lg:h-96 flex flex-col relative">
        <div className="p-5 z-10 grow flex flex-col align-center justify-center transition ease-in-out delay-150" style={{visibility: display}}>
          <div className="text-center text-white">
            <div className="text-center text-lg md:text-xl w-48 mx-auto font-semibold">
              {content}
            </div>
            <div className="text-sm mt-5">
              <Button label={linkLabel} href={href} />
            </div>
          </div>
        </div>
        <div className="py-5 z-10">
          <div className="font-bold">
            <h2 className="md:text-3xl text-white uppercase font-semibold text-center">
              {title}
            </h2>
          </div>
        </div>
        <div className="w-full absolute bottom-0 bg-gradient-to-t from-[#000]" style={{height: height}}></div>
      </section>
    </div>
  );
}
