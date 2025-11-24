import Link from 'next/link';
import './GameModeButton.css';

type GameModeButtonProps = {
  icon: string; // Puede ser un emoji o texto, luego puede ser una imagen
  title: string;
  description: string;
  color: string; // Colores predefinidos para los estilos
  linkTo: string; // A qué página nos llevará
};

export const GameModeButton = ({ icon, title, description, color, linkTo }: GameModeButtonProps) => {
  return (
    // 3. Usamos <Link> de Next.js. Funciona igual: 'href' en vez de 'to'.
    // Next.js precarga la página destino cuando el link entra en pantalla.
    <Link href={linkTo} className={`gamemode-button ${color}`}>
      <div className="button-icon">{icon}</div>
      <div className="button-text">
        <div className="button-title">{title}</div>
        <div className="button-description">{description}</div>
      </div>
    </Link>
  );
};