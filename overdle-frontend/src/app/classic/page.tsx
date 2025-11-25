// VERSIÓN: FINAL CON GUARDADO Y FECHA
// FECHA: Actualizado para enviar victoria a la DB y usar fecha del contexto
"use client"; 

import React, { useState, useEffect } from 'react';
import Link from 'next/link'; 
// Ajusta la ruta si tu UserContext está en otra carpeta, ej: '@/context/UserContext'
import { useUser } from '../../context/UserContext'; 
import './classic.css';

// Tipos
type HeroSuggestion = {
  hero_id: number;
  hero_name: string;
  image_url: string | null;
};

interface GuessResult {
  guessed_hero: {
    hero_id: number;
    hero_name: string;
    image_url: string;
    gender: string;
    role: string;
    species: string;
    launch_year: number;
  };
  correct: boolean;
  comparison: {
    gender: boolean;
    role: boolean;
    species: boolean;
    launch_year: 'correct' | 'higher' | 'lower';
  };
}

export default function ClassicPage() {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<HeroSuggestion[]>([]);
  const [selectedHero, setSelectedHero] = useState<HeroSuggestion | null>(null);
  
  const [guesses, setGuesses] = useState<GuessResult[]>([]);
  const [gameWon, setGameWon] = useState(false);
  
  // Obtenemos usuario y fecha del contexto global
  const { user, gameDate } = useUser();

  // Resetear juego si cambiamos de día (Viaje en el tiempo)
  useEffect(() => {
    setGuesses([]);
    setGameWon(false);
    setInputValue('');
  }, [gameDate]);

  // Buscador de héroes (Debounce)
  useEffect(() => {
    if (inputValue.length === 0) {
      setSuggestions([]);
      return;
    }
    if (selectedHero && inputValue === selectedHero.hero_name) return;

    const delay = setTimeout(async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/heroes/search?q=${inputValue}`);
        if (res.ok) setSuggestions(await res.json());
      } catch (error) { console.error(error); }
    }, 300);
    return () => clearTimeout(delay);
  }, [inputValue, selectedHero]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setSelectedHero(null); 
  };

  const handleSuggestionClick = (hero: HeroSuggestion) => {
    setInputValue(hero.hero_name); 
    setSelectedHero(hero);        
    setSuggestions([]);           
  };

  // --- FUNCIÓN DE GUARDADO (La pieza clave que faltaba) ---
  const saveProgress = async (won: boolean, attempts: number) => {
    if (!user) return; // Solo guardamos si hay usuario logueado

    try {
        await fetch('http://localhost:3001/api/game/progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: user.user_id,
                date: gameDate.toISOString(), // Enviamos la fecha que se jugó
                won: won,
                attempts: attempts
            })
        });
        console.log("✅ Progreso guardado correctamente.");
    } catch (e) {
        console.error("❌ Error guardando progreso:", e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHero || gameWon) return; 

    try {
      // Enviamos el intento al backend
      const response = await fetch('http://localhost:3001/api/game/classic/guess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            hero_id: selectedHero.hero_id,
            date: gameDate.toISOString() // Importante: enviamos la fecha del contexto
        }),
      });

      if (!response.ok) throw new Error('Error en validación');
      const data: GuessResult = await response.json();

      const newGuesses = [data, ...guesses];
      setGuesses(newGuesses);

      if (data.correct) {
        setGameWon(true);
        // ¡Al ganar, guardamos en la DB!
        saveProgress(true, newGuesses.length);
      }
    } catch (error) {
      console.error(error);
    }
    
    setInputValue('');
    setSelectedHero(null);
  };

  // Formato bonito de fecha para el título
  const dateDisplay = new Date(gameDate).toLocaleDateString('es-ES', { 
    weekday: 'long', day: 'numeric', month: 'long' 
  });

  return (
    <main className="classic-game-container">
      <div className="info-box">
        {/* Indicador de fecha (útil cuando viajas al pasado) */}
        <div className="date-indicator">{dateDisplay}</div>

        <h2>Modo Clásico</h2>
        {gameWon ? (
            <div className="victory-message">
                <h1 style={{ color: '#1c9e43', textShadow: '0 0 10px rgba(28, 158, 67, 0.5)' }}>¡VICTORIA!</h1>
                <p>Has descubierto al héroe.</p>
                {!user && <small style={{display:'block', color:'#777'}}>Inicia sesión para guardar tu racha.</small>}
                
                <div style={{ marginTop: '20px' }}>
                    <Link href="/emojis" className="next-mode-btn">
                        Jugar Modo Emoji ➡️
                    </Link>
                </div>
            </div>
        ) : (
            <p>Adivina el héroe de esta fecha.</p>
        )}
      </div>

      {!gameWon && (
        <form className="input-form" onSubmit={handleSubmit}>
            <div className="input-wrapper">
                <input
                type="text"
                placeholder="Escribe un héroe..."
                value={inputValue}
                onChange={handleInputChange}
                autoFocus
                />
                {suggestions.length > 0 && (
                <div className="suggestions-list">
                    {suggestions.map((hero) => (
                    <button 
                        key={hero.hero_id} 
                        type="button"
                        className="suggestion-item"
                        onClick={() => handleSuggestionClick(hero)}
                    >
                        {/* Asegúrate de que la ruta de la imagen sea correcta en tu carpeta public */}
                        <img src={hero.image_url || '/assets/unknown.png'} alt="" className="hero-avatar" />
                        <span>{hero.hero_name}</span>
                    </button>
                    ))}
                </div>
                )}
            </div>
            <button type="submit" className="submit-button">OK</button>
        </form>
      )}

      <div className="results-container">
        {guesses.map((guess, index) => (
          <div key={index} className="result-row fade-in">
            <div className={`hero-card ${guess.correct ? 'correct' : ''}`}>
               <img src={guess.guessed_hero.image_url} alt="hero" />
            </div>
            
             <div className={`attribute-box ${guess.comparison.gender ? 'correct' : 'incorrect'}`}>
              <span className="attribute-label">Género</span>
              {guess.guessed_hero.gender}
            </div>
            <div className={`attribute-box ${guess.comparison.role ? 'correct' : 'incorrect'}`}>
              <span className="attribute-label">Rol</span>
              {guess.guessed_hero.role}
            </div>
             <div className={`attribute-box ${guess.comparison.species ? 'correct' : 'incorrect'}`}>
              <span className="attribute-label">Especie</span>
              {guess.guessed_hero.species}
            </div>
            <div className={`attribute-box \
              ${guess.comparison.launch_year === 'correct' ? 'correct' : 'incorrect'} \
              ${guess.comparison.launch_year === 'higher' ? 'arrow-up' : ''}\
              ${guess.comparison.launch_year === 'lower' ? 'arrow-down' : ''}\
            `}>
              <span className="attribute-label">Año</span>
              {guess.guessed_hero.launch_year}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}