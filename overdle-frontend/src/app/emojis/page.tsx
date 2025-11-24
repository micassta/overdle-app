/**
 * overdle-frontend/src/app/emojis/page.tsx
 * -------------------------------------------
 * Página base para el modo Emoji.
 * Por ahora es sencilla para verificar que la navegación funciona.
 */
"use client";

import React from 'react';
// En este entorno específico, a veces next/link necesita ser tratado con cuidado
// pero el código estándar es correcto. Si falla, es un tema del bundler del playground.
import Link from 'next/link';

export default function EmojiPage() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      padding: '4rem', 
      color: 'white',
      textAlign: 'center',
      gap: '20px'
    }}>
      <h1 style={{ fontSize: '3rem', textShadow: '0 0 10px #FA9C1E' }}>
        🧐 Modo Emoji
      </h1>
      <p style={{ fontSize: '1.2rem' }}>
        Adivina el héroe basándote solo en emojis.
      </p>
      
      <div style={{ 
        background: '#333', 
        padding: '2rem', 
        borderRadius: '10px',
        fontSize: '4rem' 
      }}>
        🤠 🔫 🕛
      </div>

      <p>(Próximamente: Lógica del juego aquí)</p>
      
      <Link href="/classic" style={{ color: '#FA9C1E', textDecoration: 'underline' }}>
        Volver al Clásico
      </Link>
    </div>
  );
}