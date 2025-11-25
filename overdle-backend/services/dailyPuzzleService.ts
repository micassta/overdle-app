import { PrismaClient, Heroes, Skins, Abilities, Phrases, DailyPuzzles } from '@prisma/client';

const prisma = new PrismaClient();

// 1. MEJORA DE TIPADO: Usamos Genéricos <T> para decir "Esto devolverá un Héroe, o una Skin, etc."
async function getRandomItem<T>(model: any): Promise<T | null> {
  const count = await model.count();
  const skip = Math.floor(Math.random() * count);
  return await model.findFirst({
    skip: skip,
  });
}

export async function getOrCreateDailyPuzzle(date?: Date) {
  // Si no pasan fecha, usamos HOY. Si pasan fecha (Time Travel), usamos esa.
  const targetDate = date ? new Date(date) : new Date();
  targetDate.setHours(0, 0, 0, 0);

  const existingPuzzle = await prisma.dailyPuzzles.findUnique({
    where: {
      puzzle_date: targetDate,
    },
    include: {
      classic_hero: true,
    }
  });

  if (existingPuzzle) {
    return existingPuzzle;
  }

  // Si es una fecha futura, no deberíamos generar puzzle, pero asumiremos que es para hoy/pasado
  // Nota: Aquí ya no usamos 'any'. Typescript sabe que getRandomItem devuelve el tipo correcto.
  const randomHero = await getRandomItem<Heroes>(prisma.heroes);
  const randomSkin = await getRandomItem<Skins>(prisma.skins);
  const randomAbility = await getRandomItem<Abilities>(prisma.abilities);
  const randomPhrase = await getRandomItem<Phrases>(prisma.phrases);

  if (!randomHero || !randomSkin || !randomAbility || !randomPhrase) {
    throw new Error("La base de datos está incompleta, faltan datos para generar el puzzle.");
  }

  const newPuzzle = await prisma.dailyPuzzles.create({
    data: {
      puzzle_date: targetDate,
      classic_hero_id: randomHero.hero_id,
      daily_skin_id: randomSkin.skin_id,
      daily_ability_id: randomAbility.ability_id,
      daily_phrase_id: randomPhrase.phrase_id
    },
    include: {
        classic_hero: true
    }
  });

  return newPuzzle;
}

export async function checkClassicGuess(guessedHeroId: number, dateStr: string) {
  // Convertimos el string de la fecha (del contexto) a objeto Date
  const gameDate = new Date(dateStr);
  
  const puzzle = await getOrCreateDailyPuzzle(gameDate);
  
  const targetHero = await prisma.heroes.findUnique({
    where: { hero_id: puzzle.classic_hero_id }
  });

  const guessedHero = await prisma.heroes.findUnique({
    where: { hero_id: guessedHeroId }
  });

  if (!targetHero || !guessedHero) {
    throw new Error("Héroe no encontrado.");
  }

  const result = {
    guessed_hero: guessedHero,
    correct: targetHero.hero_id === guessedHero.hero_id,
    comparison: {
      gender: targetHero.gender === guessedHero.gender,
      species: targetHero.species === guessedHero.species,
      role: targetHero.role === guessedHero.role,
      launch_year: compareNumbers(targetHero.launch_year, guessedHero.launch_year), 
    }
  };

  return result;
}

function compareNumbers(target: number, guess: number): 'correct' | 'higher' | 'lower' {
  if (target === guess) return 'correct';
  return target > guess ? 'higher' : 'lower';
}

// --- NUEVA FUNCIÓN PARA EL ARCHIVO ---
export async function getPuzzleArchive(userId: number) {
  // 1. Obtenemos TODOS los puzzles pasados hasta hoy
  const allPuzzles = await prisma.dailyPuzzles.findMany({
    where: {
      puzzle_date: {
        lte: new Date() // Menor o igual a hoy
      }
    },
    orderBy: {
      puzzle_date: 'desc' // Los más recientes primero
    },
    include: {
      classic_hero: true // Traemos al héroe para mostrar la imagen si ya se ganó (opcional)
    }
  });

  // 2. Obtenemos el progreso del usuario para saber cuáles jugó
  const userProgress = await prisma.userProgress.findMany({
    where: {
      user_id: userId,
      game_mode: 'classic' // Filtramos por modo clásico
    }
  });

  // 3. Combinamos la info
  return allPuzzles.map(puzzle => {
    // Buscamos si el usuario jugó este puzzle
    // Nota: Comparamos timestamps o strings ISO para asegurar coincidencia
    const progress = userProgress.find(p => 
      new Date(p.date).toDateString() === new Date(puzzle.puzzle_date).toDateString()
    );

    let status = 'unplayed'; // Por defecto gris
    if (progress) {
      status = progress.answered ? 'won' : 'lost'; // Si answered es true (ganó), si no... (depende tu lógica de "lost")
      // En Wordle normalmente es: verde si ganaste, rojo si agotaste intentos.
      // Asumiremos que si existe registro y answered=true es WIN.
    }

    return {
      date: puzzle.puzzle_date,
      hero_image: status === 'won' ? puzzle.classic_hero.image_url : null, // Solo mostramos la cara si ganó (spoiler free)
      status: status, 
      attempts: progress?.attempts || 0
    };
  });
}