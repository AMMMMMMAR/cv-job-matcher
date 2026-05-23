import { Link } from "react-router-dom";
import { useMatchi } from "../context/MatchiContext";

export default function Header() {
  const { resetApp } = useMatchi();

  return (
    <header className="w-full top-0 sticky bg-[#f9f9f9] border-b border-zinc-200 z-50">
      <div className="flex justify-between items-center h-20 px-4 md:px-12 max-w-[1200px] mx-auto">
        <Link
          to="/"
          onClick={resetApp}
          className="text-3xl font-black text-black tracking-tighter select-none cursor-pointer hover:opacity-85 transition-opacity"
        >
          Matchi
        </Link>
      </div>
    </header>
  );
}
