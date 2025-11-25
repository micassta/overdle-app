// VERSIÓN: Con Autoverificación de Sesión
// FECHA: Limpia sesiones fantasmas al cargar
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type User = {
  user_id: number;
  username: string;
};

// Respuesta del login ahora incluye isNew
type LoginResponse = {
    user: User;
    isNew: boolean;
};

type UserContextType = {
  user: User | null;
  login: (username: string) => Promise<{ success: boolean; isNew?: boolean; message?: string }>;
  logout: () => void;
  gameDate: Date;
  setGameDate: (date: Date) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [gameDate, setGameDate] = useState<Date>(new Date());

  // 1. VERIFICACIÓN DE SESIÓN AL CARGAR
  useEffect(() => {
    const checkSession = async () => {
        const storedUserStr = localStorage.getItem('overdle_user');
        
        if (storedUserStr) {
            const storedUser = JSON.parse(storedUserStr);
            
            try {
                // Preguntamos al backend si este usuario es real
                const res = await fetch(`http://localhost:3001/api/auth/check/${storedUser.user_id}`);
                
                if (res.ok) {
                    // Si el backend dice OK, mantenemos la sesión
                    setUser(storedUser);
                } else {
                    // Si el backend dice 404 (No encontrado), borramos la sesión fantasma
                    console.warn("Sesión inválida detectada. Cerrando sesión...");
                    localStorage.removeItem('overdle_user');
                    setUser(null);
                }
            } catch (e) {
                console.error("Error verificando sesión, asumiendo offline o error:", e);
                // Opcional: Podrías mantener la sesión si es error de red, 
                // pero por seguridad en desarrollo mejor no.
            }
        }
    };

    checkSession();
  }, []);

  const login = async (username: string) => {
    try {
      const res = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      });

      if (res.ok) {
        const data: LoginResponse = await res.json();
        setUser(data.user);
        localStorage.setItem('overdle_user', JSON.stringify(data.user));
        
        // Devolvemos info extra para que el Modal muestre mensajes distintos
        return { success: true, isNew: data.isNew };
      }
      return { success: false, message: "Error en el servidor" };
    } catch (e) {
      console.error("Error en login:", e);
      return { success: false, message: "Error de conexión" };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('overdle_user');
  };

  return (
    <UserContext.Provider value={{ user, login, logout, gameDate, setGameDate }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser debe usarse dentro de UserProvider");
  return context;
}