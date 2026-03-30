import { apiRequest } from '@/lib/api'
import { DemoProvider } from '@/lib/demo-context'
import DemoClient from './DemoClient'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
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
      <div className="min-h-screen">
        <Navbar />
        <main className="max-w-215 mx-auto px-8 py-24 text-dim">
          Could not load resume.
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <DemoProvider>
        <DemoClient user={user} />
      </DemoProvider>
      <Footer />
    </div>
  )
}
