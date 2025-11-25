import { PrismaClient } from '@prisma/client';
// Asegúrate de que la ruta al servicio sea correcta según tu estructura
import { getOrCreateDailyPuzzle } from './services/dailyPuzzleService';

const prisma = new PrismaClient();

async function createYesterdayPuzzle() {
  console.log("⏳ Viajando 24 horas al pasado...");

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1); // Restamos 1 día
  
  console.log(`📅 Fecha objetivo: ${yesterday.toLocaleDateString()}`);

  // Llamamos al mismo servicio que usa la app, forzando la fecha
  const puzzle = await getOrCreateDailyPuzzle(yesterday);
  
  console.log(`✅ ¡Éxito! Se ha generado (o recuperado) el puzzle para ayer.`);
  console.log(`   Héroe Clásico: ${puzzle.classic_hero_id} (ID interno)`);
}

createYesterdayPuzzle()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });