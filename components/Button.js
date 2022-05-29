import { forwardRef } from "react";

// eslint-disable-next-line react/display-name
const Button = forwardRef(({ href, onClick, label }, ref) => (
  <a href={href} onClick={onClick} ref={ref}>
    <button className="hover:pointer rounded-3xl bg-black px-7 py-2 font-bold uppercase text-white shadow-md hover:shadow-lg active:bg-[#404040]">
      {label}
    </button>
  </a>
));

export default Button;
