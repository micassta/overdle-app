import { PrismaClient, Heroes, Skins, Abilities, Phrases, DailyPuzzles } from '@prisma/client';

const prisma = new PrismaClient();

async function getRandomItem<T>(model: any): Promise<T | null> {
  const count = await model.count();
  const skip = Math.floor(Math.random() * count);
  return await model.findFirst({
    skip: skip,
  });
}

export async function getOrCreateDailyPuzzle(date?: Date) {
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
  const gameDate = new Date(dateStr);
  const puzzle = await getOrCreateDailyPuzzle(gameDate);
  
  const targetHero = await prisma.heroes.findUnique({ where: { hero_id: puzzle.classic_hero_id } });
  const guessedHero = await prisma.heroes.findUnique({ where: { hero_id: guessedHeroId } });

  if (!targetHero || !guessedHero) throw new Error("Héroe no encontrado.");

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

// --- FUNCIÓN DE ARCHIVO ACTUALIZADA (LÓGICA AMARILLA) ---
export async function getPuzzleArchive(userId: number) {
  const allPuzzles = await prisma.dailyPuzzles.findMany({
    where: { puzzle_date: { lte: new Date() } },
    orderBy: { puzzle_date: 'desc' },
    include: { classic_hero: true }
  });

  const userProgress = await prisma.userProgress.findMany({
    where: { user_id: userId, game_mode: 'classic' }
  });

  return allPuzzles.map(puzzle => {
    const progress = userProgress.find(p => 
      new Date(p.date).toDateString() === new Date(puzzle.puzzle_date).toDateString()
    );

    let status = 'unplayed';
    
    if (progress) {
      if (progress.answered) {
          status = 'won'; // Ganó (Verde)
      } else if (progress.attempts > 0) {
          status = 'in_progress'; // Empezó pero no terminó (Amarillo)
      } else {
          status = 'lost'; // Si se rindió o perdió oficialmente (Rojo)
      }
    }

    return {
      date: puzzle.puzzle_date,
      hero_image: status === 'won' ? puzzle.classic_hero.image_url : null,
      status: status, 
      attempts: progress?.attempts || 0
    };
  });
}