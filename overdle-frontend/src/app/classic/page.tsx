"use client"; 

import React, { useState, useEffect } from 'react';
import Image from 'next/image'; 
import Link from 'next/link'; // Importamos Link para navegar
import './classic.css';

// Tipos de datos
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

  useEffect(() => {
    if (inputValue.length === 0) {
      setSuggestions([]);
      return;
    }
    if (selectedHero && inputValue === selectedHero.hero_name) return;

    const delayDebounceFn = setTimeout(async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/heroes/search?q=${inputValue}`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [inputValue, selectedHero]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    setSelectedHero(null); 
  };

  const handleSuggestionClick = (hero: HeroSuggestion) => {
    setInputValue(hero.hero_name); 
    setSelectedHero(hero);        
    setSuggestions([]);           
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedHero || gameWon) return; 

    try {
      const response = await fetch('http://localhost:3001/api/game/classic/guess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hero_id: selectedHero.hero_id }),
      });

      if (!response.ok) throw new Error('Error del servidor');
      const data: GuessResult = await response.json();

      setGuesses([data, ...guesses]);

      if (data.correct) {
        setGameWon(true);
      }
    } catch (error) {
      console.error("Error:", error);
    }
    
    setInputValue('');
    setSelectedHero(null);
  };

  return (
    <main className="classic-game-container">
      
      <div className="info-box">
        <h2>Modo Clásico</h2>
        {gameWon ? (
            <div>
                <h1 style={{ color: '#1c9e43', margin: '10px 0' }}>¡VICTORIA!</h1>
                <p>Has descubierto al héroe de hoy.</p>
                
                {/* --- BOTÓN PARA IR AL SIGUIENTE NIVEL --- */}
                <div style={{ marginTop: '20px' }}>
                    <Link href="/emojis" className="next-mode-btn">
                        Jugar Modo Emoji ➡️
                    </Link>
                </div>
            </div>
        ) : (
            <p>Adivina el héroe de hoy</p>
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
              disabled={gameWon}
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
                    <img src={hero.image_url || ''} alt="" className="hero-avatar" />
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
          <div key={index} className="result-row">
            
            <div className={`hero-card ${guess.correct ? 'correct' : ''}`}>
               <img src={guess.guessed_hero.image_url} alt={guess.guessed_hero.hero_name} />
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

            <div className={`attribute-box 
              ${guess.comparison.launch_year === 'correct' ? 'correct' : 'incorrect'} 
              ${guess.comparison.launch_year === 'higher' ? 'arrow-up' : ''}
              ${guess.comparison.launch_year === 'lower' ? 'arrow-down' : ''}
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