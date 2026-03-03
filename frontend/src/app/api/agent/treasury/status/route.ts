import { NextResponse } from 'next/server'

const BACKEND_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_BASE}/api/agent/treasury/status`, {
      cache: 'no-store'
    })

    const data = await response.json().catch(() => ({ error: 'Invalid backend response' }))

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Failed to fetch treasury status' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to fetch treasury status' },
      { status: 500 }
    )
  }
}
