import Link from "next/link";
import Button from "./Button";

const Section = ({
  title,
  subtitle,
  color = "light",
  content,
  href,
  linkLabel,
}) => {
  const styles = {
    light: {
      header: "bg-[#f2f2f2]",
      content: "bg-[#ffffff]",
      text: null,
    },
    dark: {
      header: "bg-[#3d3d3d]",
      content: "bg-[#404040]",
      text: "text-white",
    },
  };

  return (
    <section className={`md:flex md:h-96 ${styles[color].text}`}>
      <div
        className={`py-5 md:flex md:w-1/5 md:items-center md:justify-center ${styles[color].header}`}
      >
        <div className="text-center md:origin-center md:-rotate-90 md:transform md:font-bold">
          <h2 className="font-serif text-3xl font-[400] md:text-5xl">
            {title}
          </h2>
          <div className="text-sm font-thin uppercase tracking-wide md:text-xl">
            {subtitle}
          </div>
        </div>
      </div>
      <div
        className={`md:a flex min-h-[175px] flex-col items-center space-y-10 p-5 md:grow md:flex-row md:justify-center md:space-y-0  ${styles[color].content}`}
      >
        <div className="w-1/2 max-w-md text-center text-lg md:text-2xl">
          {content}
        </div>
        <div className="flex w-1/2 max-w-md justify-center text-sm">
          <Button>
            <Link href={href}>{linkLabel}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Section;
