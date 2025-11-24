// react-router-dom es para hacer lo de las diferentes páginas
import { Routes, Route } from 'react-router-dom';

// 2. Importar paginas
import { HomePage } from './pages/HomePage/HomePage';
import { ClassicGamePage } from './pages/ClassicGamePage/ClassicGamePage';
import { EmojiGamePage } from './pages/EmojiGamePage/EmojiGamePage';
import { HabilitiesGamePage } from './pages/HabilitiesGamePage/HabilitiesGamePage';

// 3. Importar barra de navegación y footer que siempre van a ser los mismos
import { NavBar } from './components/NavBar/NavBar';
import { Footer } from './components/Footer/Footer';

function App() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}> {/* Vaina de el div, basicamente toda la página está dentro de un div */}

      <NavBar /> {/*Aqui llama a la navbar que siempre va a estar activa*/}

      <Routes>
        {/* Aqui se cambia el conteido de la página, dependiendo de la URL */}
        <Route path="/" element={<HomePage />} />
        <Route path="/classic" element={<ClassicGamePage />} />
        <Route path="/emojis" element={<EmojiGamePage />} />
        <Route path="/habilities" element={<HabilitiesGamePage />} />
      </Routes>

      <Footer /> {/* El footer también será siempre visible */}  
    </div>
  )
}

export default App