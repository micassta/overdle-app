import React from 'react';
import { Link } from 'react-router-dom';
import './GameModeButton.css';

type GameModeButtonProps = {
  icon: string; // Puede ser un emoji o texto, luego puede ser una imagen
  title: string;
  description: string;
  color: 'yellow' | 'pink' | 'green'; // Colores predefinidos para los estilos
  linkTo: string; // A qué página nos llevará
};

export const GameModeButton: React.FC<GameModeButtonProps> = ({ icon, title, description, color, linkTo }) => {
  // Usamos el prop "color" para aplicar una clase CSS dinámica
  const buttonClassName = `gamemode-button ${color}`;

  return (
    // El botón es un Link de react-router-dom para navegar sin recargar
    <Link to={linkTo} className={buttonClassName}>

      <div className="button-icon">{icon}</div>
      
      <div className="button-text">
        <div className="button-title">{title}</div>
        <div className="button-description">{description}</div>
      </div>
    </Link>
  );
};