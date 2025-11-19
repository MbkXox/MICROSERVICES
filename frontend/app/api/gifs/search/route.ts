import { NextRequest, NextResponse } from 'next/server'
import { getAccessToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = await getAccessToken()
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')
    if (!q) {
      return NextResponse.json({ error: 'Query required' }, { status: 400 })
    }

    const res = await fetch(`${process.env.TENOR_SERVICE_URL || 'http://localhost:5000/gifs'}/search?q=${encodeURIComponent(q)}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to search GIFs' }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Search GIFs error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}