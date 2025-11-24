import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import { getOrCreateDailyPuzzle, checkClassicGuess } from './services/dailyPuzzleService';

const prisma = new PrismaClient();
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('¡El Backend de Overdle está vivo (TS Mode)!');
});

// --- RUTA: BÚSQUEDA DE HÉROES ---
app.get('/api/heroes/search', async (req, res) => {
    const searchQuery = req.query.q as string; // Forzamos tipo string

    if (!searchQuery || searchQuery.length < 1) {
      res.json([]);
      return; // Importante poner return para que TS sepa que la función acaba
    }
  
    try {
      const heroes = await prisma.heroes.findMany({
        where: {
          hero_name: {
            contains: searchQuery 
          }
        },
        select: {
          hero_id: true,
          hero_name: true,
          image_url: true 
        },
        take: 5 
      });
      res.json(heroes);
    } catch (error) {
      console.error("Error buscando héroes:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
});

// --- RUTA: OBTENER PUZZLE DEL DÍA ---
app.get('/api/game/daily', async (req, res) => {
    try {
      const dailyPuzzle = await getOrCreateDailyPuzzle();
      
      res.json({
          message: "Juego listo",
          puzzle_date: dailyPuzzle.puzzle_date,
          // @ts-ignore: Ignoramos error si classic_hero es opcional en tipos
          debug_solution: dailyPuzzle.classic_hero?.hero_name 
      });
  
    } catch (error) {
      console.error("Error generando puzzle diario:", error);
      res.status(500).json({ error: "Error interno creando el juego diario" });
    }
});

app.listen(port, () => {
  console.log(`Backend corriendo en http://localhost:${port}`);
});

// --- RUTA: HACER UN INTENTO (GUESS) ---
// POST /api/game/classic/guess
// Body: { "hero_id": 5 }
app.post('/api/game/classic/guess', async (req, res) => {
  const { hero_id } = req.body;

  if (!hero_id) {
     res.status(400).json({ error: "Falta el hero_id" });
     return;
  }

  try {
    const result = await checkClassicGuess(Number(hero_id));
    res.json(result);
  } catch (error) {
    console.error("Error validando intento:", error);
    res.status(500).json({ error: "Error interno validando el juego" });
  }
});

// --- RUTA: LOGIN / REGISTRO ---
// POST /api/auth/login
// Body: { "username": "TracerMain" }
app.post('/api/auth/login', async (req, res) => {
  const { username } = req.body;

  if (!username || username.trim().length < 3) {
    res.status(400).json({ error: "El nombre debe tener al menos 3 caracteres." });
    return;
  }

  try {
    // Usamos upsert: Si existe lo trae, si no, lo crea.
    // Como tu schema dice que password_hash es obligatorio, pondremos un dummy por ahora
    // ya que es un login "sin contraseña" basado solo en nombre (tipo arcade).
    const user = await prisma.users.upsert({
      where: { username: username },
      update: {}, // Si existe, no cambiamos nada
      create: {
        username: username,
        password_hash: "dummy_hash_no_password_needed", // Placeholder
      }
    });

    console.log(`👤 Usuario logueado: ${user.username} (ID: ${user.user_id})`);
    res.json(user);

  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
});