const Section = ({ title, subtitle, color = "light", content, link }) => {
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
    <section className={`${styles[color].text}`}>
      <div className={`text-center py-5 ${styles[color].header}`}>
        <div className="md:transform md:-rotate-90 md:origin-center md:font-bold md:top-32">
          <h2 className="font-serif text-3xl font-[400]">{title}</h2>
        </div>
        <div className="font-thin tracking-wide uppercase text-sm">
          {subtitle}
        </div>
      </div>
      <div className={`p-5 space-y-10 min-h-[291px] ${styles[color].content}`}>
        <div className="text-center">{content}</div>
      </div>
    </section>
  );
};

export default Section;
