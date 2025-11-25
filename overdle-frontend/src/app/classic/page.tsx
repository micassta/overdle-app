// VERSIÓN: Persistencia Completa (Carga y Guarda cada intento)
"use client"; 

import React, { useState, useEffect } from 'react';
import Link from 'next/link'; 
import { useUser } from '../../context/UserContext'; 
import './classic.css';

// ... (Tus tipos HeroSuggestion y GuessResult se mantienen igual) ...
type HeroSuggestion = { hero_id: number; hero_name: string; image_url: string | null; };
interface GuessResult {
  guessed_hero: { hero_id: number; hero_name: string; image_url: string; gender: string; role: string; species: string; launch_year: number; };
  correct: boolean;
  comparison: { gender: boolean; role: boolean; species: boolean; launch_year: 'correct' | 'higher' | 'lower'; };
}

export default function ClassicPage() {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<HeroSuggestion[]>([]);
  const [selectedHero, setSelectedHero] = useState<HeroSuggestion | null>(null);
  
  const [guesses, setGuesses] = useState<GuessResult[]>([]);
  const [gameWon, setGameWon] = useState(false);
  const [loadingGame, setLoadingGame] = useState(true); // Para que no se vea vacío mientras carga
  
  const { user, gameDate } = useUser();

  // 1. CARGAR PROGRESO AL ENTRAR
  useEffect(() => {
    const loadProgress = async () => {
        setGuesses([]);
        setGameWon(false);
        setInputValue('');
        setLoadingGame(true);

        if (!user) {
            setLoadingGame(false);
            return;
        }

        try {
            // Pedimos al backend: "¿Cómo dejé el juego este día?"
            const res = await fetch(`http://localhost:3001/api/game/load?userId=${user.user_id}&date=${gameDate.toISOString()}`);
            if (res.ok) {
                const data = await res.json();
                if (data.guesses && data.guesses.length > 0) {
                    // Invertimos el orden para que el más reciente salga arriba (si el backend los manda en orden cronológico)
                    setGuesses(data.guesses.reverse()); 
                    setGameWon(data.won);
                }
            }
        } catch (e) {
            console.error("Error cargando partida:", e);
        } finally {
            setLoadingGame(false);
        }
    };

    loadProgress();
  }, [gameDate, user]); 

  // ... (useEffects del buscador igual que antes) ...
  useEffect(() => {
    if (inputValue.length === 0) { setSuggestions([]); return; }
    if (selectedHero && inputValue === selectedHero.hero_name) return;
    const delay = setTimeout(async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/heroes/search?q=${inputValue}`);
        if (res.ok) setSuggestions(await res.json());
      } catch (error) { console.error(error); }
    }, 300);
    return () => clearTimeout(delay);
  }, [inputValue, selectedHero]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => { setInputValue(e.target.value); setSelectedHero(null); };
  const handleSuggestionClick = (hero: HeroSuggestion) => { setInputValue(hero.hero_name); setSelectedHero(hero); setSuggestions([]); };

  // 2. FUNCIÓN DE GUARDADO (Mejorada)
  const saveProgress = async (currentGuesses: GuessResult[], isWin: boolean) => {
    if (!user) return;

    // Extraemos solo los IDs para guardar en la DB (más ligero)
    // Nota: Como 'currentGuesses' tiene el último intento al principio (índice 0),
    // lo invertimos para guardar el historial cronológico [intento1, intento2, intento3]
    const guessesToSave = [...currentGuesses].reverse().map(g => g.guessed_hero.hero_id);

    try {
        await fetch('http://localhost:3001/api/game/progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: user.user_id,
                date: gameDate.toISOString(),
                won: isWin,
                attempts: currentGuesses.length,
                guesses: guessesToSave // <--- ¡AQUÍ ESTÁ LA CLAVE!
            })
        });
    } catch (e) {
        console.error("Error guardando:", e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHero || gameWon) return; 

    try {
      const response = await fetch('http://localhost:3001/api/game/classic/guess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            hero_id: selectedHero.hero_id,
            date: gameDate.toISOString() 
        }),
      });

      if (!response.ok) throw new Error('Error');
      const data: GuessResult = await response.json();

      const newGuesses = [data, ...guesses]; // Añadimos el nuevo al principio
      setGuesses(newGuesses);

      const isWin = data.correct;
      if (isWin) setGameWon(true);

      // GUARDAMOS AHORA MISMO (No esperamos a ganar)
      saveProgress(newGuesses, isWin);

    } catch (error) {
      console.error(error);
    }
    
    setInputValue('');
    setSelectedHero(null);
  };

  const dateDisplay = new Date(gameDate).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });

  if (loadingGame) return <div style={{color:'white', marginTop: 50, textAlign:'center'}}>Cargando misión...</div>;

  return (
    <main className="classic-game-container">
      <div className="info-box">
        <div className="date-indicator">{dateDisplay}</div>
        <h2>Modo Clásico</h2>
        {gameWon ? (
            <div className="victory-message fade-in">
                <h1 style={{ color: '#1c9e43', textShadow: '0 0 10px rgba(28, 158, 67, 0.5)' }}>¡VICTORIA!</h1>
                <p>Misión completada.</p>
                <div style={{ marginTop: '20px' }}>
                    <Link href="/emojis" className="next-mode-btn">Jugar Modo Emoji ➡️</Link>
                </div>
            </div>
        ) : (
            <p>Adivina el héroe de esta fecha.</p>
        )}
      </div>

      {!gameWon && (
        <form className="input-form" onSubmit={handleSubmit}>
            <div className="input-wrapper">
                <input type="text" placeholder="Escribe un héroe..." value={inputValue} onChange={handleInputChange} autoFocus />
                {suggestions.length > 0 && (
                <div className="suggestions-list">
                    {suggestions.map((hero) => (
                    <button key={hero.hero_id} type="button" className="suggestion-item" onClick={() => handleSuggestionClick(hero)}>
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
            <div className={`attribute-box ${guess.comparison.launch_year === 'correct' ? 'correct' : 'incorrect'} ${guess.comparison.launch_year === 'higher' ? 'arrow-up' : ''}${guess.comparison.launch_year === 'lower' ? 'arrow-down' : ''}`}>
              <span className="attribute-label">Año</span>
              {guess.guessed_hero.launch_year}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}