import { NextRequest, NextResponse } from 'next/server'

const BACKEND_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const response = await fetch(`${BACKEND_BASE}/api/agent/treasury/autonomy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    const data = await response.json().catch(() => ({ error: 'Invalid backend response' }))

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Failed to update autonomy level' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to update autonomy level' },
      { status: 500 }
    )
  }
}
