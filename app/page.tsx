import { apiRequest } from '@/lib/api'
import type { User } from '@/lib/types'

async function getUser(): Promise<User | null> {
  try {
    const res = await apiRequest('/users/')
    const users: User[] = await res.json()
    return users[0] ?? null
  } catch {
    return null
  }
}

function dateRange(start?: string, end?: string) {
  if (!start && !end) return null
  return [start, end ?? 'Present'].filter(Boolean).join(' – ')
}

export default async function Page() {
  const user = await getUser()

  if (!user) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-16 text-zinc-500">
        Could not load resume.
      </main>
    )
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-16 text-sm text-zinc-800 dark:text-zinc-200">

      {/* Header */}
      <section className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">{user.name}</h1>
        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-zinc-500 dark:text-zinc-400">
          {user.email && <span>{user.email}</span>}
          {user.phone && <span>{user.phone}</span>}
          {user.linkedin && <a href={user.linkedin} className="underline underline-offset-2">{user.linkedin}</a>}
          {user.website && <a href={user.website} className="underline underline-offset-2">{user.website}</a>}
        </div>
      </section>

      {/* Experience */}
      {user.experiences.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3">Experience</h2>
          <div className="space-y-5">
            {user.experiences.map(exp => (
              <div key={exp.id}>
                <div className="flex justify-between">
                  <span className="font-medium">{exp.role} — {exp.company}</span>
                  <span className="text-zinc-400 dark:text-zinc-500 shrink-0 ml-4">{dateRange(exp.start_date, exp.end_date)}</span>
                </div>
                {exp.location && <div className="text-zinc-400 dark:text-zinc-500">{exp.location}</div>}
                {exp.bullets.length > 0 && (
                  <ul className="mt-1 space-y-0.5 list-disc list-outside ml-4">
                    {exp.bullets.map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {user.education.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3">Education</h2>
          <div className="space-y-5">
            {user.education.map(edu => (
              <div key={edu.id}>
                <div className="flex justify-between">
                  <span className="font-medium">{edu.institution}</span>
                  <span className="text-zinc-400 dark:text-zinc-500 shrink-0 ml-4">{dateRange(edu.start_date, edu.end_date)}</span>
                </div>
                {edu.degree && <div className="text-zinc-400 dark:text-zinc-500">{edu.degree}</div>}
                {edu.notes.length > 0 && (
                  <ul className="mt-1 space-y-0.5 list-disc list-outside ml-4">
                    {edu.notes.map((n, i) => <li key={i}>{n}</li>)}
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
          <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3">Projects</h2>
          <div className="space-y-5">
            {user.projects.map(proj => (
              <div key={proj.id}>
                <div className="flex justify-between">
                  <span className="font-medium">{proj.name}{proj.subtitle && <span className="font-normal text-zinc-400 dark:text-zinc-500"> — {proj.subtitle}</span>}</span>
                  <span className="text-zinc-400 dark:text-zinc-500 shrink-0 ml-4">{dateRange(proj.start_date, proj.end_date)}</span>
                </div>
                {proj.bullets.length > 0 && (
                  <ul className="mt-1 space-y-0.5 list-disc list-outside ml-4">
                    {proj.bullets.map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Activities */}
      {user.activities.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3">Activities</h2>
          <div className="space-y-5">
            {user.activities.map(act => (
              <div key={act.id}>
                <div className="flex justify-between">
                  <span className="font-medium">{act.role} — {act.organization}</span>
                  <span className="text-zinc-400 dark:text-zinc-500 shrink-0 ml-4">{dateRange(act.start_date, act.end_date)}</span>
                </div>
                {act.bullets.length > 0 && (
                  <ul className="mt-1 space-y-0.5 list-disc list-outside ml-4">
                    {act.bullets.map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {user.skill_categories.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3">Skills</h2>
          <div className="space-y-1">
            {user.skill_categories.map(cat => (
              <div key={cat.id}>
                <span className="font-medium">{cat.name}: </span>
                <span className="text-zinc-500 dark:text-zinc-400">{cat.skills.join(', ')}</span>
              </div>
            ))}
          </div>
        </section>
      )}

    </main>
  )
}
