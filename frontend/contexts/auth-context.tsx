'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as jwt from 'jsonwebtoken';

interface User {
  name: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);


  // Fonction pour se déconnecter
  const logout = async () => {
    setUser(null);
    
    // Supprimer le token du localStorage
    localStorage.removeItem('access_token');
    
    // Appeler l'API de logout pour nettoyer les cookies httpOnly
    try {
      await fetch('/api/auth-logout', {
        method: 'POST',
      });

      // Rediriger vers la page de login
      window.location.href = '/';

    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  // Vérifier si l'utilisateur est authentifié
  const isAuthenticated = user !== null;

  // Restaurer la session au montage depuis le localStorage
  useEffect(() => {
    // Récupérer le token depuis l'API (cookie httpOnly)
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth-me');
        if (res.ok) {
          const { access_token } = await res.json();
          
          // Décoder le token pour récupérer les infos utilisateur
          const decoded: any = jwt.decode(access_token);
          
          // Vérifier si le token n'est pas expiré
          const currentTime = Date.now() / 1000;
          if (decoded.exp && decoded.exp > currentTime) {
            const userData: User = {
              name: decoded.sub || 'Utilisateur',
              role: decoded.role,
            };
            setUser(userData);
            // Stocker en localStorage aussi
            localStorage.setItem('access_token', access_token);
          }
        }
      } catch (error) {
        console.error('Erreur lors de la restauration de la session:', error);
      }
    };
    
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};