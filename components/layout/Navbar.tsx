import Link from "next/link";

const Navbar = () => (
  <nav className="flex justify-between items-center px-8 py-5 border-b border-indigo-500/10 sticky top-0 bg-[rgba(9,9,15,0.88)] backdrop-blur-md z-10">
    <span className="font-mono text-[0.7rem] tracking-[0.2em] text-indigo-800">
      RESUHOST
    </span>
    <div className="flex gap-7 items-center">
      <Link
        href="/resume"
        className="nav-link text-[0.8rem] text-slate-500 no-underline transition-colors duration-150"
      >
        Resume
      </Link>
      <Link
        href="/demo"
        className="text-[0.8rem] text-white no-underline px-4 py-[0.4rem] font-semibold rounded bg-linear-to-br from-indigo-600 to-violet-700"
      >
        Try Demo
      </Link>
    </div>
  </nav>
);

export default Navbar;
