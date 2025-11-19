import { cookies } from 'next/headers'

/**
 * Route pour récupérer le token d'accès depuis les cookies httpOnly.
 * Permet au contexte côté client de décoder le token.
 */
export async function GET() {
  const cookieStore = await cookies()
  
  try {
    const accessToken = cookieStore.get('access_token')?.value
    
    if (!accessToken) {
      return Response.json({ detail: 'Not authenticated' }, { status: 401 })
    }
    
    return Response.json({ access_token: accessToken })
  } catch (error) {
    return Response.json({ detail: 'Failed to get token' }, { status: 500 })
  }
}
