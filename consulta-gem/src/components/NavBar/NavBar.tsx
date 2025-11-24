//NAVBAR VER 2.0

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

// Importar los condenados iconos de mielda
import { IoSettingsSharp, IoMenu } from "react-icons/io5";
import { SettingsModal } from '../SettingsModal/SettingsModal';
import logoImage from '../../assets/ow-logo-gold.png';

// Estos son los modos de juego con su titulo y URL
const gameModes = [
  { title: 'Clásico', linkTo: '/classic' },
  { title: 'Emoji', linkTo: '/emojis' },
  { title: 'Habilidad', linkTo: '/habilities' },
];

export const NavBar: React.FC = () => {

  // Estados para controlar si el modal y el menú están abiertos
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null); // Referencia para el menú desplegable

  // Lógica para cerrar el menú si se hace clic fuera de él
  useEffect(() => {

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };

  }, [dropdownRef]);


  return (
    <>
      <header className="navbar-container">
        <div className="navbar-content">
          {/* Boton de Configuracion */}
          <button className="navbar-icon-button" onClick={() => setModalOpen(true)}>
            <IoSettingsSharp size={35} />
          </button>

          {/* Logo que te lleva a la HomePage */}
          <Link to="/" className="navbar-logo">
            <img src={logoImage} alt="Overdle Logo O" className="logo-image" />
            <span className="logo-text">VERDLE</span>
            {/* <span className="logo-text-dle">DLE</span> */}
          </Link>

          {/* Boton de Hamburguesa */}
          <div className="dropdown-wrapper" ref={dropdownRef}>
            <button className="navbar-icon-button" onClick={() => setDropdownOpen(!isDropdownOpen)}>
              <IoMenu size={45} />
            </button>
            
          {/* El menú de los modos de juego solo se renderiza si isDropdownOpen es true */}
            {isDropdownOpen && (
              <div className="dropdown-menu">
                {gameModes.map(mode => (
                  <Link 
                    key={mode.title} 
                    to={mode.linkTo} 
                    className="dropdown-item"
                    onClick={() => setDropdownOpen(false)} // Cierra el menú al hacer clic
                  >
                    {mode.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>
      
      <SettingsModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

// import React from 'react';

// 
// import { Link } from 'react-router-dom';
// import './NavBar.css';

// import ow_logo from '../../assets/ow-logo.png';

// export const NavBar: React.FC = () => {
//   return (
//     <header className="navbar-container">

//       <Link to="/" className="navbar-logo">
//         <img src={ow_logo} alt="Overdle Logo O" className="ow-logo" />
//         <span className="logo-text">VER</span>
//         <span className="logo-text-dle">DLE</span>
//       </Link>
      
//       <nav className="navbar-links">
//         <Link to="/classic">❓Classic</Link> {/* Le agrega a la URL /classic, y así con todos */}
//         <Link to="/emojis">🤔Emoji</Link>
//         <Link to="/habilities">🔁Habilidad</Link>
//         <Link to="/login" className="login-button">Iniciar Sesión</Link>
//       </nav>
//     </header>
//   );
// };