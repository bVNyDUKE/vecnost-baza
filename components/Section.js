const Section = ({ title, subtitle, children }) => (
  <section className="h-52">
    <div className="bg-[#f2f2f2] text-center py-5">
      <div className="md:transform md:-rotate-90 md:origin-center md:font-bold md:top-32">
        <h2 className="font-serif text-3xl font-[400]">{title}</h2>
      </div>
      <div className="font-thin tracking-wide uppercase text-sm">
        {subtitle}
      </div>
    </div>
    <div>{children}</div>
  </section>
);

export default Section;
