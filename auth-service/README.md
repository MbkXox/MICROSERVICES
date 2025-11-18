# Auth Service

Service d'authentification basé sur FastAPI pour les microservices.

## Prérequis

- Python 3.8+
- pip

## Installation

1. Installez les dépendances :
   ```bash
   pip install -r requirements.txt
   ```

2. Copiez le fichier d'environnement :
   ```bash
   cp .env.example .env
   ```

3. Modifiez `.env` selon vos besoins (clé JWT, etc.).

## Lancement

Lancez le serveur en mode développement :
```bash
uvicorn main:app --reload -port 8000
```

Le service sera accessible sur `http://localhost:8000`.

## Endpoints

- `/docs` : Documentation Swagger
- `/auth/register` : Inscription
- `/auth/login` : Connexion
- `/auth/refresh` : Rafraîchissement du token
- `/.well-known/jwks.json` : Clés publiques JWT
- `/health` : Santé du service

## Base de données

Utilise SQLite (`auth.db`). La base est initialisée automatiquement au démarrage.</content>
<parameter name="filePath">c:\Users\mbare\Desktop\M1-DEV\DEV-OPS\microservices\auth-service\README.md