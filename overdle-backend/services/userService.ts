// VERSIÓN: Robustez para datos Legacy (Guesses Nulos)
// FECHA: Permite recuperar victorias antiguas sin historial de intentos
import { PrismaClient } from '@prisma/client';
import { checkClassicGuess } from './dailyPuzzleService'; 

const prisma = new PrismaClient();

export async function loginOrRegisterUser(username: string) {
  const user = await prisma.users.upsert({
    where: { username: username },
    update: {},
    create: {
      username: username,
      password_hash: "dummy",
    },
  });
  return user;
}

export async function saveUserProgress(
    userId: number, 
    dateStr: string, 
    won: boolean, 
    attempts: number,
    guessedHeroIds: number[] 
) {
  const gameDate = new Date(dateStr);
  
  const existingProgress = await prisma.userProgress.findFirst({
    where: { user_id: userId, date: gameDate, game_mode: 'classic' }
  });

  if (existingProgress) {
    if (existingProgress.answered) return existingProgress;

    return await prisma.userProgress.update({
      where: { progress_id: existingProgress.progress_id },
      data: {
        attempts: attempts,
        answered: won,
        guesses: JSON.stringify(guessedHeroIds) 
      }
    });
  } else {
    return await prisma.userProgress.create({
      data: {
        user_id: userId,
        date: gameDate,
        game_mode: 'classic',
        attempts: attempts,
        answered: won,
        guesses: JSON.stringify(guessedHeroIds)
      }
    });
  }
}

// --- ESTA ES LA FUNCIÓN CORREGIDA ---
export async function getUserGameState(userId: number, dateStr: string) {
    const gameDate = new Date(dateStr);

    const progress = await prisma.userProgress.findFirst({
        where: { user_id: userId, date: gameDate, game_mode: 'classic' }
    });

    // Si no existe progreso absoluto, devolvemos null
    if (!progress) return null;

    // MANEJO DE GUESSES:
    // Si 'guesses' es null (datos viejos) pero 'answered' es true, 
    // devolvemos una lista vacía pero con won: true.
    let reconstructedGuesses: any[] = [];
    
    if (progress.guesses) {
        const guessedIds = JSON.parse(progress.guesses as string) as number[];
        for (const heroId of guessedIds) {
            try {
                const comparison = await checkClassicGuess(heroId, dateStr);
                reconstructedGuesses.push(comparison);
            } catch (e) {
                console.error(`Error reconstruyendo guess ${heroId}`, e);
            }
        }
    }

    return {
        won: progress.answered, // Esto es lo importante: la DB manda si ganó o no
        guesses: reconstructedGuesses
    };
}