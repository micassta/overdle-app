import React, { useState } from 'react';
import './ClassicGamePage.css';

// Importamos base de datos y el type Hero 
import { heroes, type Hero } from '../../data/heroes';

export const ClassicGamePage: React.FC = () => {
  // ESTADOS: La memoria de nuestro componente
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<Hero[]>([]); // Aquí es donde se usa el TIPO "Hero"

  // LÓGICA: Las funciones que se ejecutan con las acciones del usuario
  
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);

    if (value.length > 0) {
      const filteredHeroes = heroes.filter(hero =>
        hero.name.toLowerCase().startsWith(value.toLowerCase())
      );
      setSuggestions(filteredHeroes);
    } 
    else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (heroName: string) => {
    setInputValue(heroName);
    setSuggestions([]);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!inputValue) return;

    console.log(`Respuesta enviada: ${inputValue}`);
    
    setInputValue('');
  };

  return (
    // 4. ESTRUCTURA (JSX): Lo que se ve en pantalla
    <main className="classic-game-container">
      <div className="info-box">
        <h2>¡Adivina el Héroe de Overwatch de hoy!</h2>
        <p>Escribe el nombre de un héroe para empezar.</p>
      </div>

      <form className="input-form" onSubmit={handleSubmit}>
        <div className="input-wrapper">
          <input
            type="text"
            placeholder="Escribe el nombre del héroe..."
            value={inputValue}
            onChange={handleInputChange}
            autoComplete="off"
          />
          {suggestions.length > 0 && (
            <div className="suggestions-list">
              {suggestions.map((hero) => (
                <button 
                  key={hero.id} 
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(hero.name)}
                >
                  <img src={hero.avatarUrl} alt={hero.name} className="hero-avatar" />
                  <span>{hero.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <button type="submit" className="submit-button">OK</button>
      </form>

      <div className="yesterdays-hero">
        <p>El héroe de ayer fue: <strong>Mercy</strong></p>
      </div>
    </main>
  );
};