import { apiRequest } from '@/lib/api'
import { DemoProvider } from '@/lib/demo-context'
import DemoClient from './DemoClient'
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

export default async function DemoPage() {
  const user = await getUser()

  if (!user) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-16 text-zinc-500">
        Could not load resume.
      </main>
    )
  }

  return (
    <DemoProvider>
      <DemoClient user={user} />
    </DemoProvider>
  )
}
