import { NextResponse } from 'next/server'
import { apiRequest } from '@/lib/api'

export async function POST(request: Request) {
  const { userId, jobDescription, model } = await request.json()

  if (!userId || !jobDescription) {
    return NextResponse.json({ error: 'Missing userId or jobDescription' }, { status: 400 })
  }

  try {
    const res = await apiRequest(`/resume/${userId}/tailor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ job_description: jobDescription, ...(model ? { model } : {}) }),
    })
    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Tailor failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
