"""
Routes d'authentification du service :
- /register : création d'un utilisateur
- /login    : authentification + émission des tokens JWT
- /refresh  : renouvellement de l'access token via un refresh token
"""

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlmodel import Session, select

from models import User, RegisterRequest, LoginRequest, TokenResponse, MessageResponse, RefreshRequest, RefreshResponse
from db import get_session
from security import (
    create_token,
    verify_password,
    hash_password,
    decode_token,
)

router = APIRouter()


# ---------------------------------------------------------------------
# 🟦 Register : création d’un utilisateur
# ---------------------------------------------------------------------
@router.post("/register", response_model=MessageResponse)
async def register(request: RegisterRequest, session: Session = Depends(get_session)):
    """
    Création d'un utilisateur.
    """

    username = request.username
    password = request.password

    # Vérifie l'unicité du username
    existing = session.exec(
        select(User).where(User.username == username)
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Username already exists")

    # Création de l'utilisateur (mot de passe haché)
    user = User(
        username=username,
        password_hash=hash_password(password),
    )

    session.add(user)
    session.commit()

    return {"message": "User created"}


# ---------------------------------------------------------------------
# 🟦 Login : authentification + création des tokens
# ---------------------------------------------------------------------
@router.post("/login", response_model=TokenResponse)
async def login(request: LoginRequest, session: Session = Depends(get_session)):
    """
    Authentifie un utilisateur et retourne les tokens JWT.
    """

    username = request.username
    password = request.password

    # Recherche de l'utilisateur
    user = session.exec(
        select(User).where(User.username == username)
    ).first()

    # Vérification du mot de passe
    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Génération des tokens JWT
    access = create_token(username)
    refresh = create_token(username, refresh=True)

    return {
        "access_token": access,
        "refresh_token": refresh,
        "token_type": "bearer",
        "expires_in": 60 * 60,  # 1h exprimée en secondes
    }


# ---------------------------------------------------------------------
# 🟦 Refresh : renouvellement du token d'accès
# ---------------------------------------------------------------------
@router.post("/refresh", response_model=RefreshResponse)
async def refresh(request: RefreshRequest):
    """
    Échange un refresh token contre un nouvel access token.
    """

    refresh_token = request.refresh_token

    try:
        # Décodage du refresh token
        payload = decode_token(refresh_token)

        # Vérification du type
        if payload.get("type") != "refresh":
            raise ValueError("Invalid token type")

        # Nouveau token d'accès
        new_access = create_token(payload["sub"])
        return {"access_token": new_access}

    except Exception:
        # Token expiré / modifié / signature invalide
        raise HTTPException(status_code=401, detail="Invalid refresh token")
