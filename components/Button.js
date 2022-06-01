import Link from "next/link";

const Button = ({ href, label, onClick = null }) => {
  if (href) {
    return (
      <Link href={href}>
        <a className="hover:pointer rounded-3xl bg-black px-7 py-2 font-bold uppercase text-white shadow-md hover:shadow-lg active:bg-[#404040]">
          {label}
        </a>
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className="hover:pointer rounded-3xl bg-black px-7 py-2 font-bold uppercase text-white shadow-md hover:shadow-lg active:bg-[#404040]"
    >
      {label}
    </button>
  );
};

export default Button;
