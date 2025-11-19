import { cookies } from 'next/headers'

/**
 * Déconnexion : supprime les cookies httpOnly contenant les tokens.
 */
export async function POST() {
  const cookieStore = await cookies()
  
  try {
    // Supprimer les tokens
    cookieStore.delete('access_token')
    cookieStore.delete('refresh_token')
    
    return Response.json({ ok: true })
  } catch (error) {
    return Response.json({ detail: 'logout failed' }, { status: 500 })
  }
}
