import Link from "next/link";

const Footer = () => (
  <footer className="border-t border-indigo-500/10 px-8 py-6 flex justify-between items-center flex-wrap gap-4">
    <span className="font-mono text-[0.65rem] text-slate-800">
      © 2026 Zackary Overend
    </span>
    <div className="flex gap-6">
      {[
        { label: "Resume", href: "/resume" },
        { label: "Demo", href: "/demo" },
      ].map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className="nav-link font-mono text-[0.65rem] text-slate-700 no-underline transition-colors duration-150"
        >
          {l.label}
        </Link>
      ))}
    </div>
  </footer>
);

export default Footer;
