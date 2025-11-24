import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Tipado genérico para saber qué estamos devolviendo
async function getRandomItem<T>(model: any): Promise<T | null> {
  const count = await model.count();
  const skip = Math.floor(Math.random() * count);
  return await model.findFirst({
    skip: skip,
  });
}

export async function getOrCreateDailyPuzzle() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existingPuzzle = await prisma.dailyPuzzles.findUnique({
    where: {
      puzzle_date: today,
    },
    include: {
      classic_hero: true,
    }
  });

  if (existingPuzzle) {
    console.log("✅ Puzzle de hoy encontrado en caché (DB).");
    return existingPuzzle;
  }

  console.log("🎲 No hay puzzle hoy. Generando uno nuevo...");

  // Como estamos en TS, aquí podríamos tipar mejor los modelos, 
  // pero usando 'any' en el helper o pasando el delegado de prisma funciona rápido.
  const randomHero = await getRandomItem(prisma.heroes);
  const randomSkin = await getRandomItem(prisma.skins);
  const randomAbility = await getRandomItem(prisma.abilities);
  const randomPhrase = await getRandomItem(prisma.phrases);

  if (!randomHero || !randomSkin || !randomAbility || !randomPhrase) {
    throw new Error("La base de datos está incompleta.");
  }

  // TypeScript se quejará si los objetos pueden ser null, así que aseguramos:
  // (En un código real harías validaciones más estrictas)
  const newPuzzle = await prisma.dailyPuzzles.create({
    data: {
      puzzle_date: today,
      classic_hero_id: (randomHero as any).hero_id,
      daily_skin_id: (randomSkin as any).skin_id,
      daily_ability_id: (randomAbility as any).ability_id,
      daily_phrase_id: (randomPhrase as any).phrase_id
    },
    include: {
        classic_hero: true
    }
  });

  console.log(`✨ Nuevo puzzle generado.`);
  return newPuzzle;
}


export async function checkClassicGuess(guessedHeroId: number) {
  // 1. Obtenemos el puzzle de hoy
  const puzzle = await getOrCreateDailyPuzzle();
  
  // 2. Buscamos los datos del héroe CORRECTO (Target)
  const targetHero = await prisma.heroes.findUnique({
    where: { hero_id: puzzle.classic_hero_id }
  });

  // 3. Buscamos los datos del héroe que el usuario ADIVINÓ (Guess)
  const guessedHero = await prisma.heroes.findUnique({
    where: { hero_id: guessedHeroId }
  });

  if (!targetHero || !guessedHero) {
    throw new Error("Héroe no encontrado.");
  }

  // 4. LA LÓGICA DE COMPARACIÓN (El corazón del juego)
  // Comparamos campo por campo.
  
  const result = {
    guessed_hero: guessedHero, // Devolvemos info para pintar la tarjeta
    correct: targetHero.hero_id === guessedHero.hero_id,
    comparison: {
      gender: targetHero.gender === guessedHero.gender,
      species: targetHero.species === guessedHero.species,
      role: targetHero.role === guessedHero.role,
      // Para el año, indicamos si es mayor, menor o igual
      launch_year: compareNumbers(targetHero.launch_year, guessedHero.launch_year), 
    }
  };

  return result;
}

// Helper para decir si el año es mayor, menor o igual
function compareNumbers(target: number, guess: number): 'correct' | 'higher' | 'lower' {
  if (target === guess) return 'correct';
  return target > guess ? 'higher' : 'lower';
}