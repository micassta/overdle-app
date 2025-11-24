"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type User = {
  user_id: number;
  username: string;
};

type UserContextType = {
  user: User | null;
  login: (username: string) => Promise<boolean>;
  logout: () => void;
  gameDate: Date;
  setGameDate: (date: Date) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [gameDate, setGameDate] = useState<Date>(new Date());

  useEffect(() => {
    const storedUser = localStorage.getItem('overdle_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (username: string) => {
    try {
      const res = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      });

      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
        localStorage.setItem('overdle_user', JSON.stringify(userData));
        return true;
      }
      return false;
    } catch (e) {
      console.error("Error en login:", e);
      return false;
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