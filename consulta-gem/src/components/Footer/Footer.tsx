import React from 'react';
import './Footer.css';

export const Footer: React.FC = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <p>© 2025 Overdle. Inspirado en smashdle.net. Página Académica.</p>
        <div className="footer-links">
          {/* Esto lleva a la wea de Acerca de, el boton pues */}
          <a href="/acerca-de">Más</a>
        </div>
      </div>
    </footer>
  );
};