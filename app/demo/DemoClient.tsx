"use client";

import { useState } from "react";
import { useDemo } from "@/lib/demo-context";
import type { User } from "@/lib/types";

function dateRange(start?: string, end?: string) {
  if (!start && !end) return null;
  return [start, end ?? "Present"].filter(Boolean).join(" – ");
}

function buildOriginalData(user: User) {
  return {
    experiences: user.experiences.map((e) => ({
      id: e.id,
      bullets: e.bullets,
    })),
    projects: user.projects.map((p) => ({ id: p.id, bullets: p.bullets })),
    activities: user.activities.map((a) => ({ id: a.id, bullets: a.bullets })),
  };
}

const MODELS = [
  { value: "gemini-3-flash-preview:cloud", label: "Gemini 3 Flash (fast)" },
  { value: "ministral-3:8b-cloud", label: "Ministral 3 8B (fast)" },
  { value: "qwen3.5:cloud", label: "Qwen 3.5 (thinking)" },
  { value: "mistral-large-3:675b-cloud", label: "Mistral Large 3" },
  { value: "kimi-k2:1t-cloud", label: "Kimi K2" },
];

export default function DemoClient({ user }: { user: User }) {
  const {
    tailoredBullets,
    setTailoredBullets,
    clearTailoring,
    snapshots,
    addSnapshot,
    deleteSnapshot,
  } = useDemo();
  const [jobDescription, setJobDescription] = useState("");
  const [selectedModel, setSelectedModel] = useState(MODELS[0].value);
  const [tailoring, setTailoring] = useState(false);
  const [tailorError, setTailorError] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [snapshotLabel, setSnapshotLabel] = useState("");

  const hasTailoring =
    Object.keys(tailoredBullets.experiences).length > 0 ||
    Object.keys(tailoredBullets.projects).length > 0 ||
    Object.keys(tailoredBullets.activities).length > 0;

  async function handleTailor() {
    if (!jobDescription.trim()) return;
    setTailoring(true);
    setTailorError(null);
    try {
      const res = await fetch("/api/demo/tailor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          jobDescription,
          model: selectedModel,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      const bullets = {
        experiences: Object.fromEntries(
          data.experiences.map((e: { id: string; bullets: string[] }) => [
            e.id,
            e.bullets,
          ]),
        ),
        projects: Object.fromEntries(
          data.projects.map((p: { id: string; bullets: string[] }) => [
            p.id,
            p.bullets,
          ]),
        ),
        activities: Object.fromEntries(
          data.activities.map((a: { id: string; bullets: string[] }) => [
            a.id,
            a.bullets,
          ]),
        ),
      };
      setTailoredBullets(bullets);
    } catch (err) {
      setTailorError(err instanceof Error ? err.message : "Tailor failed");
    } finally {
      setTailoring(false);
    }
  }

  async function handleDownloadPdf() {
    setPdfLoading(true);
    try {
      const tailoredData = hasTailoring
        ? {
            experiences: user.experiences.map((e) => ({
              id: e.id,
              bullets: tailoredBullets.experiences[e.id] ?? e.bullets,
            })),
            projects: user.projects.map((p) => ({
              id: p.id,
              bullets: tailoredBullets.projects[p.id] ?? p.bullets,
            })),
            activities: user.activities.map((a) => ({
              id: a.id,
              bullets: tailoredBullets.activities[a.id] ?? a.bullets,
            })),
          }
        : null;

      const res = await fetch("/api/demo/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          tailoredData,
          originalData: buildOriginalData(user),
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "resume.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert(err instanceof Error ? err.message : "PDF failed");
    } finally {
      setPdfLoading(false);
    }
  }

  function handleSaveSnapshot() {
    if (!snapshotLabel.trim()) return;
    addSnapshot(snapshotLabel.trim(), { ...tailoredBullets });
    setSnapshotLabel("");
  }

  function handleRestoreSnapshot(id: string) {
    const snap = snapshots.find((s) => s.id === id);
    if (snap) setTailoredBullets(snap.tailoredBullets);
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-16 text-sm text-zinc-800 dark:text-zinc-200">
      {/* Demo banner */}
      <div className="mb-8 rounded border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 p-4">
        <p className="font-medium mb-3">
          Demo Mode — paste a job description to tailor this resume
        </p>
        <textarea
          className="w-full rounded border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-zinc-400"
          rows={4}
          placeholder="Paste job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />
        {tailorError && (
          <p className="mt-1 text-red-500 text-xs">{tailorError}</p>
        )}
        <div className="mt-2 flex flex-wrap gap-2">
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="rounded border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-zinc-400"
          >
            {MODELS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
          <button
            onClick={handleTailor}
            disabled={tailoring || !jobDescription.trim()}
            className="px-3 py-1.5 rounded bg-zinc-800 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-medium disabled:opacity-40"
          >
            {tailoring ? "Tailoring…" : "Tailor Resume"}
          </button>
          {hasTailoring && (
            <button
              onClick={clearTailoring}
              className="px-3 py-1.5 rounded border border-zinc-300 dark:border-zinc-600 text-xs"
            >
              Clear Tailoring
            </button>
          )}
          <button
            onClick={handleDownloadPdf}
            disabled={pdfLoading}
            className="px-3 py-1.5 rounded border border-zinc-300 dark:border-zinc-600 text-xs disabled:opacity-40"
          >
            {pdfLoading
              ? "Generating…"
              : hasTailoring
                ? "Download Tailored PDF"
                : "Download PDF"}
          </button>
        </div>

        {/* Snapshots */}
        <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-700">
          <p className="text-xs text-zinc-500 mb-2">
            Save this tailored version as a snapshot
          </p>
          <div className="flex gap-2">
            <input
              className="flex-1 rounded border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-zinc-400"
              placeholder="Snapshot label"
              value={snapshotLabel}
              onChange={(e) => setSnapshotLabel(e.target.value)}
            />
            <button
              onClick={handleSaveSnapshot}
              disabled={!snapshotLabel.trim()}
              className="px-3 py-1.5 rounded border border-zinc-300 dark:border-zinc-600 text-xs disabled:opacity-40"
            >
              Save
            </button>
          </div>
          {snapshots.length > 0 && (
            <ul className="mt-2 space-y-1">
              {snapshots.map((snap) => (
                <li
                  key={snap.id}
                  className="flex items-center justify-between text-xs text-zinc-500"
                >
                  <span>{snap.label}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRestoreSnapshot(snap.id)}
                      className="underline underline-offset-2"
                    >
                      restore
                    </button>
                    <button
                      onClick={() => deleteSnapshot(snap.id)}
                      className="underline underline-offset-2"
                    >
                      delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Header */}
      <section className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">{user.name}</h1>
        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-zinc-500 dark:text-zinc-400">
          {user.email && <span>{user.email}</span>}
          {user.phone && <span>{user.phone}</span>}
          {user.linkedin && (
            <a href={user.linkedin} className="underline underline-offset-2">
              {user.linkedin}
            </a>
          )}
          {user.website && (
            <a href={user.website} className="underline underline-offset-2">
              {user.website}
            </a>
          )}
        </div>
      </section>

      {/* Experience */}
      {user.experiences.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3">
            Experience
          </h2>
          <div className="space-y-5">
            {user.experiences.map((exp) => {
              const bullets =
                tailoredBullets.experiences[exp.id] ?? exp.bullets;
              const isTailored = !!tailoredBullets.experiences[exp.id];
              return (
                <div key={exp.id}>
                  <div className="flex justify-between">
                    <span className="font-medium">
                      {exp.role} — {exp.company}
                    </span>
                    <span className="text-zinc-400 dark:text-zinc-500 shrink-0 ml-4">
                      {dateRange(exp.start_date, exp.end_date)}
                    </span>
                  </div>
                  {exp.location && (
                    <div className="text-zinc-400 dark:text-zinc-500">
                      {exp.location}
                    </div>
                  )}
                  {bullets.length > 0 && (
                    <ul
                      className={`mt-1 space-y-0.5 list-disc list-outside ml-4 ${isTailored ? "text-blue-700 dark:text-blue-400" : ""}`}
                    >
                      {bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Education */}
      {user.education.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3">
            Education
          </h2>
          <div className="space-y-5">
            {user.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between">
                  <span className="font-medium">{edu.institution}</span>
                  <span className="text-zinc-400 dark:text-zinc-500 shrink-0 ml-4">
                    {dateRange(edu.start_date, edu.end_date)}
                  </span>
                </div>
                {edu.degree && (
                  <div className="text-zinc-400 dark:text-zinc-500">
                    {edu.degree}
                  </div>
                )}
                {edu.notes.length > 0 && (
                  <ul className="mt-1 space-y-0.5 list-disc list-outside ml-4">
                    {edu.notes.map((n, i) => (
                      <li key={i}>{n}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {user.projects.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3">
            Projects
          </h2>
          <div className="space-y-5">
            {user.projects.map((proj) => {
              const bullets = tailoredBullets.projects[proj.id] ?? proj.bullets;
              const isTailored = !!tailoredBullets.projects[proj.id];
              return (
                <div key={proj.id}>
                  <div className="flex justify-between">
                    <span className="font-medium">
                      {proj.name}
                      {proj.subtitle && (
                        <span className="font-normal text-zinc-400 dark:text-zinc-500">
                          {" "}
                          — {proj.subtitle}
                        </span>
                      )}
                    </span>
                    <span className="text-zinc-400 dark:text-zinc-500 shrink-0 ml-4">
                      {dateRange(proj.start_date, proj.end_date)}
                    </span>
                  </div>
                  {bullets.length > 0 && (
                    <ul
                      className={`mt-1 space-y-0.5 list-disc list-outside ml-4 ${isTailored ? "text-blue-700 dark:text-blue-400" : ""}`}
                    >
                      {bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Activities */}
      {user.activities.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3">
            Activities
          </h2>
          <div className="space-y-5">
            {user.activities.map((act) => {
              const bullets = tailoredBullets.activities[act.id] ?? act.bullets;
              const isTailored = !!tailoredBullets.activities[act.id];
              return (
                <div key={act.id}>
                  <div className="flex justify-between">
                    <span className="font-medium">
                      {act.role} — {act.organization}
                    </span>
                    <span className="text-zinc-400 dark:text-zinc-500 shrink-0 ml-4">
                      {dateRange(act.start_date, act.end_date)}
                    </span>
                  </div>
                  {bullets.length > 0 && (
                    <ul
                      className={`mt-1 space-y-0.5 list-disc list-outside ml-4 ${isTailored ? "text-blue-700 dark:text-blue-400" : ""}`}
                    >
                      {bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Skills */}
      {user.skill_categories.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3">
            Skills
          </h2>
          <div className="space-y-1">
            {user.skill_categories.map((cat) => (
              <div key={cat.id}>
                <span className="font-medium">{cat.name}: </span>
                <span className="text-zinc-500 dark:text-zinc-400">
                  {cat.skills.join(", ")}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
