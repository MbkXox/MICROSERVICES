from sqlmodel import SQLModel, Field
from typing import Optional
from pydantic import BaseModel

class User(SQLModel, table=True):
    """
    Modèle SQLModel représentant un utilisateur.
    - id : clé primaire auto-incrémentée
    - username : identifiant unique
    - password_hash : hash sécurisé du mot de passe
    """
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True)
    password_hash: str


# DTOs pour les requêtes et réponses
class RegisterRequest(BaseModel):
    username: str
    password: str


class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str
    expires_in: int


class MessageResponse(BaseModel):
    message: str


class RefreshRequest(BaseModel):
    refresh_token: str


class RefreshResponse(BaseModel):
    access_token: str