"use client";

import { useSyncExternalStore } from "react";

const THEMES = [
  { id: "default", accent: "#6366f1", label: "Indigo" },
  { id: "rose",    accent: "#f43f5e", label: "Rose" },
  { id: "emerald", accent: "#10b981", label: "Emerald" },
  { id: "amber",   accent: "#f59e0b", label: "Amber" },
];

const SunIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4" />
    <line x1="12" y1="2" x2="12" y2="4" /><line x1="12" y1="20" x2="12" y2="22" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="2" y1="12" x2="4" y2="12" /><line x1="20" y1="12" x2="22" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

// Subscribe to data-theme / data-mode attribute changes on <html>
function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme", "data-mode"],
  });
  return () => observer.disconnect();
}

const getTheme = () => document.documentElement.getAttribute("data-theme") ?? "default";
const getMode  = () => document.documentElement.getAttribute("data-mode")  ?? "dark";

const ThemeSwitcher = () => {
  const activeTheme = useSyncExternalStore(subscribe, getTheme, () => "default");
  const mode        = useSyncExternalStore(subscribe, getMode,  () => "dark");

  const setTheme = (id: string) => {
    localStorage.setItem("theme", id);
    document.documentElement.setAttribute("data-theme", id);
  };

  const toggleMode = () => {
    const next = mode === "dark" ? "light" : "dark";
    localStorage.setItem("mode", next);
    document.documentElement.setAttribute("data-mode", next);
  };

  return (
    <div className="flex gap-3 items-center">
      <div className="flex gap-1.5 items-center">
        {THEMES.map((t) => (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            title={t.label}
            className="w-2.5 h-2.5 rounded-full transition-[transform,opacity] duration-150 hover:scale-125"
            style={{
              background: t.accent,
              opacity: activeTheme === t.id ? 1 : 0.3,
              outline: activeTheme === t.id ? `2px solid ${t.accent}` : "none",
              outlineOffset: "2px",
            }}
          />
        ))}
      </div>
      <button
        onClick={toggleMode}
        title={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        className="text-muted hover:text-secondary transition-colors duration-150"
      >
        {mode === "dark" ? <SunIcon /> : <MoonIcon />}
      </button>
    </div>
  );
};

export default ThemeSwitcher;
