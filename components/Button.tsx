import Link from "next/link";

type ButtonProps = {
  href?: string;
  label: string;
  onClick?: () => void;
};

export default function Button({ href, label, onClick }: ButtonProps) {
  if (href) {
    return (
      <Link href={href}>
        <a className="hover:pointer rounded-3xl bg-black px-7 py-2 text-center font-bold uppercase text-white shadow-md hover:shadow-lg active:bg-[#404040]">
          {label}
        </a>
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className="hover:pointer rounded-3xl bg-black px-7 py-2 text-center font-bold uppercase text-white shadow-md hover:shadow-lg active:bg-[#404040]"
    >
      {label}
    </button>
  );
}
