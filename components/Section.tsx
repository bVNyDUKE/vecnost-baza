import Button from "./Button";

const Section = ({
  title,
  content,
  href,
  linkLabel,
}: {
  title: string;
  content: React.ReactNode;
  href: string;
  linkLabel: string;
}) => {
  return (
    <div className="group">
      <section className="group-even:text-white md:flex md:h-96">
        <div
          className="py-5 group-odd:bg-primary-light 
        group-even:bg-primary-dark md:flex md:w-1/5 md:items-center md:justify-center"
        >
          <div className="text-center md:origin-center md:-rotate-90 md:transform md:font-bold">
            <h2 className="font-serif text-3xl font-[400] md:text-5xl">
              {title}
            </h2>
          </div>
        </div>
        <div
          className="md:a flex min-h-[175px] flex-col items-center space-y-10 p-5
         group-odd:bg-secondary-light group-even:bg-secondary-dark md:grow md:flex-row md:justify-center md:space-y-0"
        >
          <div className="w-1/2 max-w-md text-center text-lg md:text-2xl">
            {content}
          </div>
          <div className="flex w-1/2 max-w-md justify-center text-sm">
            <Button label={linkLabel} href={href} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Section;
