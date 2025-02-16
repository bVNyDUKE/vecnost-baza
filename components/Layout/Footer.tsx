import { Facebook, Instagram, Linkedin } from "../Icons";

const socials = [
  {
    id: "Facebook",
    href: "https://www.facebook.com/vecnostcom",
    icon: <Facebook />,
  },
  {
    id: "LinkedIn",
    href: "https://www.linkedin.com/company/vecnostcom/",
    icon: <Linkedin />,
  },
  {
    id: "Instagram",
    href: "https://www.instagram.com/vecnostcom/",
    icon: <Instagram />,
  },
];

export default function Footer() {
  return (
    <footer className="relative mt-16 bg-linear-to-r from-[#000] to-[#3d3d3d] py-5 text-center text-white">
      <div className="absolute top-[-3rem] left-1/2 flex -translate-x-1/2 transform gap-4">
        {socials.map((s) => (
          <a target="_blank" aria-label={s.id} key={s.id} href={s.href}>
            {s.icon}
          </a>
        ))}
      </div>

      <div className="container mx-auto">
        <div className="flex justify-center">
          <div className="flex-1 text-lg font-semibold">
            &copy; {new Date().getFullYear()} vecnost.com
          </div>
        </div>
      </div>
    </footer>
  );
}
