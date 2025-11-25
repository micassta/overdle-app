// VERSIÓN: Con Verificación de Sesión y Detección de Usuario Existente
// FECHA: Corrección del problema "Usuario Fantasma"
import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';

import { 
  getOrCreateDailyPuzzle, 
  checkClassicGuess, 
  getPuzzleArchive 
} from './services/dailyPuzzleService';

import { saveUserProgress, getUserGameState, loginOrRegisterUser } from './services/userService'; 


const prisma = new PrismaClient();
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('¡El Backend de Overdle está vivo!');
});

// --- RUTA: BÚSQUEDA DE HÉROES ---
app.get('/api/heroes/search', async (req, res) => {
    const searchQuery = req.query.q as string;
    if (!searchQuery || searchQuery.length < 1) {
      res.json([]);
      return; 
    }
    try {
      const heroes = await prisma.heroes.findMany({
        where: { hero_name: { contains: searchQuery } },
        select: { hero_id: true, hero_name: true, image_url: true },
        take: 5 
      });
      res.json(heroes);
    } catch (error) {
      res.status(500).json({ error: "Error interno" });
    }
});

// --- RUTA: OBTENER PUZZLE ---
app.get('/api/game/daily', async (req, res) => {
    const dateQuery = req.query.date as string;
    const targetDate = dateQuery ? new Date(dateQuery) : undefined;

    try {
      const dailyPuzzle = await getOrCreateDailyPuzzle(targetDate);
      res.json({
          message: "Juego listo",
          puzzle_date: dailyPuzzle.puzzle_date,
          debug_solution: dailyPuzzle.classic_hero?.hero_name 
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error creando juego" });
    }
});

// --- RUTA: INTENTO (GUESS) ---
app.post('/api/game/classic/guess', async (req, res) => {
  const { hero_id, date } = req.body;
  if (!hero_id) { res.status(400).json({ error: "Falta hero_id" }); return; }
  const gameDateStr = date || new Date().toISOString();

  try {
    const result = await checkClassicGuess(Number(hero_id), gameDateStr);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Error validando" });
  }
});

// ==========================================
//      RUTAS DE AUTENTICACIÓN MEJORADAS
// ==========================================

// 1. VERIFICAR SESIÓN (NUEVA)
// El frontend llamará a esto al cargar para ver si el usuario del localStorage es real
app.get('/api/auth/check/:userId', async (req, res) => {
    const userId = Number(req.params.userId);
    
    try {
        const user = await prisma.users.findUnique({
            where: { user_id: userId }
        });

        if (user) {
            res.json({ valid: true, user });
        } else {
            // Si no encuentra al usuario, dice que es inválido
            res.status(404).json({ valid: false });
        }
    } catch (error) {
        res.status(500).json({ error: "Error verificando sesión" });
    }
});

// 2. LOGIN INTELIGENTE (ACTUALIZADA)
// Ahora distingue entre "Crear Nuevo" y "Entrar a Existente"
app.post('/api/auth/login', async (req, res) => {
  const { username } = req.body;

  if (!username || username.trim().length < 3) {
    res.status(400).json({ error: "El nombre debe tener al menos 3 caracteres." });
    return;
  }

  try {
    // Primero buscamos si existe
    const existingUser = await prisma.users.findUnique({
        where: { username: username }
    });

    if (existingUser) {
        // SI EXISTE: Lo devolvemos y avisamos que NO es nuevo
        console.log(`👋 Usuario recurrente: ${username}`);
        res.json({ user: existingUser, isNew: false });
    } else {
        // SI NO EXISTE: Lo creamos y avisamos que ES nuevo
        const newUser = await prisma.users.create({
            data: {
                username: username,
                password_hash: "dummy", 
            }
        });
        console.log(`✨ Usuario nuevo creado: ${username}`);
        res.json({ user: newUser, isNew: true });
    }

  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
});

// --- RUTA: GUARDAR PROGRESO (Actualizada) ---
app.post('/api/game/progress', async (req, res) => {
  // Ahora esperamos "guesses" en el body
  const { userId, date, won, attempts, guesses } = req.body; 

  if (!userId || !date) { res.status(400).json({ error: "Faltan datos" }); return; }

  try {
    const userExists = await prisma.users.findUnique({ where: { user_id: Number(userId) }});
    if (!userExists) { res.status(404).json({ error: "Usuario no encontrado" }); return; }

    const progress = await saveUserProgress(
        Number(userId), 
        date, 
        Boolean(won), 
        Number(attempts),
        guesses || [] // Pasamos los guesses
    );
    res.json({ success: true, progress });
  } catch (error) {
    console.error("Error guardando:", error);
    res.status(500).json({ error: "Error guardando progreso" });
  }
});

// --- RUTA: CARGAR PARTIDA (NUEVA) ---
app.get('/api/game/load', async (req, res) => {
    const { userId, date } = req.query;
    
    if (!userId || !date) { 
        res.status(400).json({ error: "Faltan datos" }); 
        return; 
    }

    try {
        const gameState = await getUserGameState(Number(userId), String(date));
        // Si no hay nada guardado, devolvemos un estado vacío
        res.json(gameState || { guesses: [], won: false }); 
    } catch (error) {
        console.error("Error cargando partida:", error);
        res.status(500).json({ error: "Error cargando partida" });
    }
});

// --- RUTA: ARCHIVO ---
app.get('/api/archive', async (req, res) => {
  const userId = req.query.userId;
  if (!userId) { res.status(400).json({ error: "Falta userId" }); return; }

  try {
    const archiveData = await getPuzzleArchive(Number(userId));
    res.json(archiveData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo archivo" });
  }
});

app.listen(port, () => {
  console.log(`Backend corriendo en http://localhost:${port}`);
});