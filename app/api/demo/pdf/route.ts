import { apiRequest } from '@/lib/api'

type BulletItem = { id: string; bullets: string[] }
type TailorPayload = { experiences: BulletItem[]; projects: BulletItem[]; activities: BulletItem[] }

export async function POST(request: Request) {
  const { userId, tailoredData, originalData }: {
    userId: string
    tailoredData: TailorPayload | null
    originalData: TailorPayload
  } = await request.json()

  let snapshotId: string | null = null
  let tailorApplied = false

  try {
    if (tailoredData) {
      await apiRequest(`/resume/${userId}/apply-tailor`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tailoredData),
      })
      tailorApplied = true
    }

    const snapRes = await apiRequest(`/users/${userId}/resumes/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ label: 'demo-ephemeral' }),
    })
    const snap = await snapRes.json()
    snapshotId = snap.id

    const pdfRes = await apiRequest(`/resume/${userId}?snapshot_id=${snapshotId}`, {
      method: 'POST',
    })
    const pdfBuffer = await pdfRes.arrayBuffer()

    await apiRequest(`/users/${userId}/resumes/${snapshotId}`, { method: 'DELETE' })
    snapshotId = null

    return new Response(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="resume.pdf"',
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'PDF generation failed'
    return new Response(message, { status: 500 })
  } finally {
    if (tailorApplied) {
      await apiRequest(`/resume/${userId}/apply-tailor`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(originalData),
      }).catch(() => {})
    }
    if (snapshotId) {
      await apiRequest(`/users/${userId}/resumes/${snapshotId}`, { method: 'DELETE' }).catch(() => {})
    }
  }
}
