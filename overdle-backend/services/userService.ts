import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 1. LOGIN / REGISTRO AUTOMÁTICO
export async function loginOrRegisterUser(username: string) {
  // Prisma 'upsert' maneja la lógica de "si existe devuélvelo, si no créalo"
  const user = await prisma.users.upsert({
    where: { username: username },
    update: {}, // No actualizamos nada si ya existe, solo lo devolvemos
    create: {
      username: username,
      password_hash: "dummy_hash", // Como es login sin pass, ponemos un placeholder
    },
  });
  return user;
}

// 2. GUARDAR PROGRESO
export async function saveUserProgress(userId: number, dateStr: string, won: boolean, attempts: number) {
  const gameDate = new Date(dateStr);
  
  // Buscamos si ya existe progreso para este día
  const existingProgress = await prisma.userProgress.findFirst({
    where: {
      user_id: userId,
      date: gameDate,
      game_mode: 'classic'
    }
  });

  if (existingProgress) {
    // Si ya ganó, no dejamos que se sobrescriba como perdido
    if (existingProgress.answered) return existingProgress;

    // Actualizamos intentos y si ganó esta vez
    return await prisma.userProgress.update({
      where: { progress_id: existingProgress.progress_id },
      data: {
        attempts: attempts,
        answered: won
      }
    });
  } else {
    // Creamos nuevo registro de progreso
    return await prisma.userProgress.create({
      data: {
        user_id: userId,
        date: gameDate,
        game_mode: 'classic',
        attempts: attempts,
        answered: won
      }
    });
  }
}