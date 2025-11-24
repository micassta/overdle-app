import { GameModeButton } from "@/components/GameModeButton/GameModeButton";
// Puedes crear un archivo page.css o importar el css aquí si lo moviste
import "./home.css"; 

const gameModes = [
  { icon: '❓', title: 'Clásico', description: 'Adivina el Héroe en cada intento', color: 'owrange', linkTo: '/classic' },
  { icon: '🤔', title: 'Emoji', description: 'Adivina el Héroe con emojis', color: 'green', linkTo: '/emojis' },
  { icon: '🔁', title: 'Habilidad', description: 'Adivina con una habilidad', color: 'pink', linkTo: '/habilities' },
];

export default function Home() {
  return (
    <main className="homepage-container">
      <div className="title-container">
        <h1 className="main-title">ACTIVE CALL</h1>
        <p className="subtitle">¡Adivina los Héroes de Overwatch!</p>
      </div>

      <div className="game-modes-list">
        {gameModes.map((mode) => (
          <GameModeButton
            key={mode.title}
            {...mode} // Truco: pasa todas las propiedades del objeto como props
          />
        ))}
      </div>
    </main>
  );
}
