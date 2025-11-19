import { NextRequest, NextResponse } from 'next/server'
import { getAccessToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = await getAccessToken()
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
      const res = await fetch(`${process.env.TENOR_SERVICE_URL || 'http://localhost:5000/gifs'}/favorites`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Get favorites error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = await getAccessToken()
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    const res = await fetch(`${process.env.TENOR_SERVICE_URL || 'http://localhost:5000/gifs'}/favorites`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to add favorite' }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Add favorite error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}