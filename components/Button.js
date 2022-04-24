const Button = ({ children }) => (
  <button className="hover:pointer rounded-3xl bg-black px-7 py-2 font-bold uppercase text-white shadow-md hover:shadow-lg active:bg-[#404040]">
    {children}
  </button>
);

export default Button;
