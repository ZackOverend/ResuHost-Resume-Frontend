export type Experience = {
  id: string
  company: string
  role: string
  location?: string
  start_date?: string
  end_date?: string
  bullets: string[]
}

export type Education = {
  id: string
  institution: string
  degree?: string
  location?: string
  start_date?: string
  end_date?: string
  notes: string[]
}

export type Project = {
  id: string
  name: string
  subtitle?: string
  start_date?: string
  end_date?: string
  bullets: string[]
}

export type Activity = {
  id: string
  role: string
  organization: string
  start_date?: string
  end_date?: string
  bullets: string[]
}

export type SkillCategory = {
  id: string
  name: string
  skills: string[]
}

export type User = {
  id: string
  name: string
  email: string
  phone?: string
  linkedin?: string
  website?: string
  experiences: Experience[]
  education: Education[]
  projects: Project[]
  activities: Activity[]
  skill_categories: SkillCategory[]
}
