import './Footer.css';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <p>© 2025 Overdle. Inspirado en smashdle.net.</p>
        <div className="footer-links">
          {/* Si /acerca-de es una pagina interna, usa Link. Si es externa usa <a> */}
          <Link href="/acerca-de">Más</Link>
        </div>
      </div>
    </footer>
  );
};