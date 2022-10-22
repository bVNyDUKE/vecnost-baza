import Link from "next/link";
import { Facebook, Instagram, Linkedin } from "../Icons";

export default function Footer() {
  return (
    <footer className="relative mt-16 bg-gradient-to-r from-[#000] to-[#3d3d3d] py-5 text-center text-white">
      <div className="absolute top-[-3rem] left-1/2 flex -translate-x-1/2 transform gap-4">
        {/* Facebook */}
        <Link href="https://www.facebook.com/vecnostcom">
          <a target="_blank" aria-label="Facebook">
            <div>
              <Facebook />
            </div>
          </a>
        </Link>

        {/* Linkedin */}
        <Link href="https://www.linkedin.com/company/vecnostcom/">
          <a target="_blank" aria-label="LinkedIn">
            <div>
              <Linkedin />
            </div>
          </a>
        </Link>

        {/* Instagram */}
        <Link href="https://www.instagram.com/vecnostcom/">
          <a target="_blank" aria-label="Instagram">
            <div>
              <Instagram />
            </div>
          </a>
        </Link>
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
