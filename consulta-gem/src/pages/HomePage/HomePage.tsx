import React from 'react';
import { GameModeButton } from '../../components/GameModeButton/GameModeButton';
import './HomePage.css';

// 1. Definimos los datos de nuestros modos de juego en un array.
// ¡Si quieres añadir un nuevo modo, solo tienes que añadir un objeto aquí!
const gameModes = [
  { icon: '❓', title: 'Clásico', description: 'Adivina el Héroe en cada intento', color: 'owrange', linkTo: '/classic' },
  { icon: '🤔', title: 'Emoji', description: 'Adivina el Héroe con un una serie de emojis', color: 'green', linkTo: '/emojis' },
  { icon: '🔁', title: 'Habilidad', description: 'Adivina con una animación de Habilidad', color: 'pink', linkTo: '/habilities' },
  // { icon: '🔊', title: 'Frase', description: '¿Qué Héroe dice esta frase?', color: 'yellow', linkTo: '/jugar/frase' },
  // { icon: '🎨', title: 'Spray', description: 'Adivina con un spray del juego', color: 'pink', linkTo: '/jugar/spray' },
  // { icon: '👤', title: 'Silueta', description: 'Adivina con una sombra', color: 'green', linkTo: '/jugar/silueta' },
];

export const HomePage: React.FC = () => {
  return (
    <main className="homepage-container">
      <div className="title-container">
        <h1 className="main-title">ACTIVE CALL</h1>
        <p className="subtitle">¡Adivina los Héroes de Overwatch!</p>
      </div>

      <div className="game-modes-list">
        {/* Usamos .map() para crear un GameModeButton por cada objeto en nuestro array */}
        {gameModes.map((mode) => (
          <GameModeButton
            key={mode.title} // "key" es importante para React al renderizar listas
            icon={mode.icon}
            title={mode.title}
            description={mode.description}
            color={mode.color as any} // Usamos "as any" temporalmente por el tipado
            linkTo={mode.linkTo}
          />
        ))}
      </div>
    </main>
  );
};