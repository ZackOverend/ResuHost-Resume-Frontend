import Link from "next/link";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher";

const Navbar = () => (
  <nav className="flex justify-between items-center px-8 py-5 border-b border-accent/10 sticky top-0 bg-base/88 backdrop-blur-md z-10">
    <Link
      href="/"
      className="font-mono text-[0.7rem] tracking-[0.2em] text-accent"
    >
      RESUHOST
    </Link>
    <div className="flex gap-7 items-center">
      <ThemeSwitcher />
      <Link
        href="/resume"
        className="nav-link text-[0.8rem] text-dim no-underline transition-colors duration-150"
      >
        Resume
      </Link>
      <Link
        href="/demo"
        className="text-[0.8rem] text-white no-underline px-4 py-[0.4rem] font-semibold rounded bg-linear-to-br from-accent to-vivid"
      >
        Try Demo
      </Link>
    </div>
  </nav>
);

export default Navbar;
