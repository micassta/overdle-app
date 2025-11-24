"use client"; 

import React, { useState } from 'react';
import Link from 'next/link'; 
import Image from 'next/image'; 
import { useUser } from '../../context/UserContext'; 

import './NavBar.css';
import { IoSettingsSharp, IoPersonCircleSharp, IoCalendarClear, IoTime, IoToday } from "react-icons/io5";
import { SettingsModal } from '../SettingsModal/SettingsModal';
import { LoginModal } from '../LoginModal/LoginModal';

export const NavBar = () => {
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [isLoginOpen, setLoginOpen] = useState(false);
  
  const { user, gameDate } = useUser();

  const isToday = new Date().toDateString() === new Date(gameDate).toDateString();
  
  const dateString = new Date(gameDate).toLocaleDateString('es-ES', { 
    day: 'numeric', month: 'short', year: 'numeric' 
  });

  return (
    <>
      <header className={`navbar-container ${!isToday ? 'past-mode' : ''}`}>
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
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span className="logo-text">VERDLE</span>
                
                <span className={`time-travel-badge ${isToday ? 'today-badge' : ''}`}>
                    {isToday ? <IoToday style={{ marginRight: 4 }} /> : <IoTime style={{ marginRight: 4 }} />}
                    {dateString}
                </span>
            </div>
          </Link>

          <button 
            className="navbar-icon-button login-btn" 
            onClick={() => setLoginOpen(true)}
            title={user ? `Hola, ${user.username}` : "Iniciar Sesión"}
          >
            {user ? (
                <div className="user-avatar-small">
                    {user.username.charAt(0).toUpperCase()}
                </div>
            ) : (
                <IoPersonCircleSharp size={40} />
            )}
          </button>
          
        </div>
      </header>
      
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setSettingsOpen(false)} />
      <LoginModal isOpen={isLoginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
};