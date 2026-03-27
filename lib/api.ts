const API_URL = process.env.API_URL
const API_SECRET_KEY = process.env.API_SECRET_KEY

if (!API_URL || !API_SECRET_KEY) {
  throw new Error('API_URL and API_SECRET_KEY must be set in environment variables')
}

export async function apiRequest(path: string, init?: RequestInit): Promise<Response> {
  const url = `${API_URL}${path}`
  const headers = new Headers(init?.headers)
  headers.set('X-API-Key', API_SECRET_KEY!)

  const response = await fetch(url, { ...init, headers })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`API ${response.status}: ${text}`)
  }

  return response
}
