"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useDemo } from "@/lib/demo-context";
import type { User } from "@/lib/types";
import type { ReactNode } from "react";

function dateRange(start?: string, end?: string) {
  if (!start && !end) return null;
  return [start, end ?? "Present"].filter(Boolean).join(" – ");
}

function buildOriginalData(user: User) {
  return {
    experiences: user.experiences.map((e) => ({ id: e.id, bullets: e.bullets })),
    projects: user.projects.map((p) => ({ id: p.id, bullets: p.bullets })),
    activities: user.activities.map((a) => ({ id: a.id, bullets: a.bullets })),
  };
}

const MODELS = [
  { value: "gemini-3-flash-preview:cloud", label: "Gemini 3 Flash" },
  { value: "ministral-3:8b-cloud", label: "Ministral 3 8B" },
  { value: "qwen3.5:cloud", label: "Qwen 3.5" },
  { value: "mistral-large-3:675b-cloud", label: "Mistral Large 3" },
  { value: "kimi-k2:1t-cloud", label: "Kimi K2" },
];

const ResumeSection = ({ label, children }: { label: string; children: ReactNode }) => (
  <section className="mb-12">
    <div className="border-t border-accent/10 pt-6 mb-6 font-mono text-[0.6rem] tracking-[0.15em] text-accent uppercase">
      {label}
    </div>
    <div className="space-y-7">{children}</div>
  </section>
);

type EntryProps = {
  index: number;
  title: string;
  titleSub?: string;
  meta?: string | null;
  sub?: string;
  bullets: string[];
  isTailored: boolean;
};

const ResumeEntry = ({ index, title, titleSub, meta, sub, bullets, isTailored }: EntryProps) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.06 }}
  >
    <div className="flex justify-between items-start gap-4 mb-1">
      <span className="text-secondary font-medium text-[0.9rem]">
        {title}
        {titleSub && <span className="font-normal text-dim"> — {titleSub}</span>}
      </span>
      {meta && <span className="text-faint text-[0.8rem] shrink-0">{meta}</span>}
    </div>
    {sub && <div className="text-dim text-[0.82rem] mb-1">{sub}</div>}
    {bullets.length > 0 && (
      <ul
        className={`mt-1.5 space-y-1 list-disc list-outside ml-4 text-[0.82rem] leading-relaxed ${
          isTailored ? "text-accent" : "text-muted"
        }`}
      >
        {bullets.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
    )}
  </motion.div>
);

export default function DemoClient({ user }: { user: User }) {
  const { tailoredBullets, setTailoredBullets, clearTailoring, snapshots, addSnapshot, deleteSnapshot } =
    useDemo();
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
        body: JSON.stringify({ userId: user.id, jobDescription, model: selectedModel }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setTailoredBullets({
        experiences: Object.fromEntries(
          data.experiences.map((e: { id: string; bullets: string[] }) => [e.id, e.bullets]),
        ),
        projects: Object.fromEntries(
          data.projects.map((p: { id: string; bullets: string[] }) => [p.id, p.bullets]),
        ),
        activities: Object.fromEntries(
          data.activities.map((a: { id: string; bullets: string[] }) => [a.id, a.bullets]),
        ),
      });
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
        body: JSON.stringify({ userId: user.id, tailoredData, originalData: buildOriginalData(user) }),
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
    <main className="max-w-215 mx-auto px-8 py-[clamp(4rem,8vw,6rem)]">
      {/* Tailor panel */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-16 border border-accent/10 rounded-lg p-6 bg-accent/3 backdrop-blur-md"
      >
        <div className="font-mono text-[0.6rem] tracking-[0.15em] text-accent uppercase mb-4">
          AI Tailoring
        </div>
        <textarea
          className="w-full rounded border border-accent/12 bg-transparent text-body text-[0.85rem] px-3 py-2.5 resize-none placeholder:text-faint focus:outline-none focus:border-accent/30 leading-relaxed"
          rows={4}
          placeholder="Paste a job description to tailor every bullet point…"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />
        {tailorError && <p className="mt-1.5 text-red-400 text-xs">{tailorError}</p>}

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="rounded border border-accent/12 bg-transparent text-muted text-xs px-2.5 py-1.5 focus:outline-none focus:border-accent/30"
          >
            {MODELS.map((m) => (
              <option key={m.value} value={m.value} className="bg-base">
                {m.label}
              </option>
            ))}
          </select>

          <button
            onClick={handleTailor}
            disabled={tailoring || !jobDescription.trim()}
            className="px-4 py-1.5 rounded bg-linear-to-br from-accent to-vivid text-white text-xs font-semibold disabled:opacity-40"
          >
            {tailoring ? "Tailoring…" : "Tailor Resume"}
          </button>

          {hasTailoring && (
            <button
              onClick={clearTailoring}
              className="btn-secondary px-4 py-1.5 rounded border border-surface text-muted text-xs transition-[border-color,color] duration-150"
            >
              Clear
            </button>
          )}

          <button
            onClick={handleDownloadPdf}
            disabled={pdfLoading}
            className="btn-secondary px-4 py-1.5 rounded border border-surface text-muted text-xs transition-[border-color,color] duration-150 disabled:opacity-40 ml-auto"
          >
            {pdfLoading ? "Generating…" : hasTailoring ? "Download Tailored PDF" : "Download PDF"}
          </button>
        </div>

        {hasTailoring && (
          <div className="mt-5 pt-5 border-t border-accent/10">
            <div className="font-mono text-[0.6rem] tracking-[0.15em] text-accent uppercase mb-3">
              Snapshots
            </div>
            <div className="flex gap-2">
              <input
                className="flex-1 rounded border border-accent/12 bg-transparent text-body text-xs px-3 py-1.5 placeholder:text-faint focus:outline-none focus:border-accent/30"
                placeholder="Label this version…"
                value={snapshotLabel}
                onChange={(e) => setSnapshotLabel(e.target.value)}
              />
              <button
                onClick={handleSaveSnapshot}
                disabled={!snapshotLabel.trim()}
                className="px-3 py-1.5 rounded border border-accent/12 text-muted text-xs disabled:opacity-40"
              >
                Save
              </button>
            </div>
            {snapshots.length > 0 && (
              <ul className="mt-3 space-y-1.5">
                {snapshots.map((snap) => (
                  <li key={snap.id} className="flex items-center justify-between text-xs text-dim">
                    <span>{snap.label}</span>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleRestoreSnapshot(snap.id)}
                        className="text-accent hover:text-accent transition-colors duration-150"
                      >
                        restore
                      </button>
                      <button
                        onClick={() => deleteSnapshot(snap.id)}
                        className="hover:text-body transition-colors duration-150"
                      >
                        delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </motion.div>

      {/* Resume header */}
      <motion.section
        className="mb-12"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
      >
        <h1
          className="text-[clamp(2rem,5vw,3.5rem)] font-semibold tracking-[-0.03em] text-primary mb-3"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          {user.name}
        </h1>
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-[0.82rem] text-dim">
          {user.email && <span>{user.email}</span>}
          {user.phone && <span>{user.phone}</span>}
          {user.linkedin && (
            <a href={user.linkedin} className="hover:text-body transition-colors duration-150 underline underline-offset-2">
              {user.linkedin}
            </a>
          )}
          {user.website && (
            <a href={user.website} className="hover:text-body transition-colors duration-150 underline underline-offset-2">
              {user.website}
            </a>
          )}
        </div>
      </motion.section>

      {/* Experience */}
      {user.experiences.length > 0 && (
        <ResumeSection label="Experience">
          {user.experiences.map((exp, i) => (
            <ResumeEntry
              key={exp.id}
              index={i}
              title={`${exp.role} — ${exp.company}`}
              meta={dateRange(exp.start_date, exp.end_date)}
              sub={exp.location}
              bullets={tailoredBullets.experiences[exp.id] ?? exp.bullets}
              isTailored={!!tailoredBullets.experiences[exp.id]}
            />
          ))}
        </ResumeSection>
      )}

      {/* Education */}
      {user.education.length > 0 && (
        <ResumeSection label="Education">
          {user.education.map((edu, i) => (
            <ResumeEntry
              key={edu.id}
              index={i}
              title={edu.institution}
              meta={dateRange(edu.start_date, edu.end_date)}
              sub={edu.degree}
              bullets={edu.notes}
              isTailored={false}
            />
          ))}
        </ResumeSection>
      )}

      {/* Projects */}
      {user.projects.length > 0 && (
        <ResumeSection label="Projects">
          {user.projects.map((proj, i) => (
            <ResumeEntry
              key={proj.id}
              index={i}
              title={proj.name}
              titleSub={proj.subtitle}
              meta={dateRange(proj.start_date, proj.end_date)}
              bullets={tailoredBullets.projects[proj.id] ?? proj.bullets}
              isTailored={!!tailoredBullets.projects[proj.id]}
            />
          ))}
        </ResumeSection>
      )}

      {/* Activities */}
      {user.activities.length > 0 && (
        <ResumeSection label="Activities">
          {user.activities.map((act, i) => (
            <ResumeEntry
              key={act.id}
              index={i}
              title={`${act.role} — ${act.organization}`}
              meta={dateRange(act.start_date, act.end_date)}
              bullets={tailoredBullets.activities[act.id] ?? act.bullets}
              isTailored={!!tailoredBullets.activities[act.id]}
            />
          ))}
        </ResumeSection>
      )}

      {/* Skills */}
      {user.skill_categories.length > 0 && (
        <ResumeSection label="Skills">
          <motion.div
            className="space-y-1.5 text-[0.85rem]"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {user.skill_categories.map((cat) => (
              <div key={cat.id}>
                <span className="text-body font-medium">{cat.name}: </span>
                <span className="text-dim">{cat.skills.join(", ")}</span>
              </div>
            ))}
          </motion.div>
        </ResumeSection>
      )}
    </main>
  );
}
