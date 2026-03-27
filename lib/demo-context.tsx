'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

export type TailoredBullets = {
  experiences: Record<string, string[]>
  projects: Record<string, string[]>
  activities: Record<string, string[]>
}

export type EphemeralSnapshot = {
  id: string
  label: string
  createdAt: string
  tailoredBullets: TailoredBullets
}

type DemoContextType = {
  tailoredBullets: TailoredBullets
  setTailoredBullets: (bullets: TailoredBullets) => void
  clearTailoring: () => void
  snapshots: EphemeralSnapshot[]
  addSnapshot: (label: string, bullets: TailoredBullets) => void
  deleteSnapshot: (id: string) => void
}

const empty: TailoredBullets = { experiences: {}, projects: {}, activities: {} }

const DemoContext = createContext<DemoContextType | null>(null)

export function DemoProvider({ children }: { children: ReactNode }) {
  const [tailoredBullets, setTailoredBullets] = useState<TailoredBullets>(empty)
  const [snapshots, setSnapshots] = useState<EphemeralSnapshot[]>([])

  const clearTailoring = useCallback(() => setTailoredBullets(empty), [])

  const addSnapshot = useCallback((label: string, bullets: TailoredBullets) => {
    setSnapshots(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        label,
        createdAt: new Date().toISOString(),
        tailoredBullets: bullets,
      },
    ])
  }, [])

  const deleteSnapshot = useCallback((id: string) => {
    setSnapshots(prev => prev.filter(s => s.id !== id))
  }, [])

  return (
    <DemoContext.Provider value={{ tailoredBullets, setTailoredBullets, clearTailoring, snapshots, addSnapshot, deleteSnapshot }}>
      {children}
    </DemoContext.Provider>
  )
}

export function useDemo() {
  const ctx = useContext(DemoContext)
  if (!ctx) throw new Error('useDemo must be used within a DemoProvider')
  return ctx
}
