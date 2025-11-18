"""
Route de santé du service d'authentification.
Permet de vérifier que le service est opérationnel.
"""

from fastapi import APIRouter
from datetime import datetime

router = APIRouter()


@router.get("/health")
async def health_check():
    """
    Point de terminaison de santé publique.
    Retourne le statut du service sans nécessiter d'authentification.
    """
    return {
        "status": "ok",
        "service": "auth-service",
        "timestamp": datetime.utcnow().isoformat(),
    }