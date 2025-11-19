import { NextRequest, NextResponse } from 'next/server'
import { getAccessToken } from '@/lib/auth'

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const token = await getAccessToken()
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const res = await fetch(`${process.env.TENOR_SERVICE_URL || 'http://localhost:5000/gifs'}/favorites/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to delete favorite' }, { status: res.status })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete favorite error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}