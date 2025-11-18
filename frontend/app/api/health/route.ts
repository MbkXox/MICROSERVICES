/**
 * Route publique de diagnostic.
 * Ne nécessite aucun token, ne passe par aucun middleware.
 * Renvoie uniquement un statut opérationnel minimal.
 */
export async function GET() {
  return Response.json({
    status: 'ok',
    service: 'frontend-gateway',
    timestamp: new Date().toISOString(),
  })
}