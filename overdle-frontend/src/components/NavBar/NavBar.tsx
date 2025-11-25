// VERSIÓN: Corregida para evitar Error de Hidratación (Hydration Mismatch)
// FECHA: Solución al problema de fechas servidor vs cliente
"use client"; 

import React, { useState, useEffect } from 'react';
import Link from 'next/link'; 
import Image from 'next/image'; 
// Ajusta esta ruta si tu UserContext está en otro lado (ej: '@/context/UserContext')
import { useUser } from '../../context/UserContext'; 

import './NavBar.css';
import { IoSettingsSharp, IoPersonCircleSharp, IoCalendarClear, IoTime, IoToday } from "react-icons/io5";

// Asegúrate de que estos componentes existan en tu proyecto
import { SettingsModal } from '../SettingsModal/SettingsModal';
import { LoginModal } from '../LoginModal/LoginModal';

export const NavBar = () => {
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [isLoginOpen, setLoginOpen] = useState(false);
  
  // Estado para saber si el componente ya se montó en el cliente
  const [mounted, setMounted] = useState(false);
  
  const { user, gameDate } = useUser();

  // useEffect se ejecuta SOLO en el cliente después del primer render
  useEffect(() => {
    setMounted(true);
  }, []);

  // Cálculos de fecha
  const today = new Date();
  const gameDateObj = new Date(gameDate);
  
  const isToday = today.toDateString() === gameDateObj.toDateString();
  
  const dateString = gameDateObj.toLocaleDateString('es-ES', { 
    day: 'numeric', month: 'short', year: 'numeric' 
  });

  return (
    <>
      <header className={`navbar-container ${mounted && !isToday ? 'past-mode' : ''}`}>
        <div className="navbar-content">
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
             <button className="navbar-icon-button" onClick={() => setSettingsOpen(true)}>
                <IoSettingsSharp size={30} />
             </button>

             <Link href="/archive" className="navbar-icon-button" title="Archivo de Juegos">
                <IoCalendarClear size={30} />
             </Link>
          </div>

          <Link href="/" className="navbar-logo"> 
            <Image 
              src="/assets/ow-logo-gold.png" 
              alt="Logo" 
              width={80} 
              height={80}
              className="logo-image"
              priority 
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span className="logo-text">VERDLE</span>
                
                {/* SOLUCIÓN AL ERROR: Solo renderizamos la fecha si ya estamos "montados" en el cliente */}
                {mounted ? (
                    <span className={`time-travel-badge ${isToday ? 'today-badge' : ''}`}>
                        {isToday ? <IoToday style={{ marginRight: 4 }} /> : <IoTime style={{ marginRight: 4 }} />}
                        {dateString}
                    </span>
                ) : (
                    // Placeholder invisible para evitar saltos bruscos mientras carga
                    <span className="time-travel-badge" style={{ opacity: 0 }}>
                        Cargando...
                    </span>
                )}
            </div>
          </Link>

          <button 
            className="navbar-icon-button login-btn" 
            onClick={() => setLoginOpen(true)}
            title={user ? `Hola, ${user.username}` : "Iniciar Sesión"}
          >
            {/* También protegemos el renderizado del usuario para evitar desajustes */}
            {mounted && user ? (
                <div className="user-avatar-small">
                    {user.username.charAt(0).toUpperCase()}
                </div>
            ) : (
                <IoPersonCircleSharp size={40} />
            )}
          </button>
          
        </div>
      </header>
      
      {/* Modales */}
      {/* Asegúrate de tener el componente SettingsModal creado, si no, comenta esta línea */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setSettingsOpen(false)} />
      <LoginModal isOpen={isLoginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
};