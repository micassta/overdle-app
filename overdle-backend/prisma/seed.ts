// import { PrismaClient } from '@prisma/client';
// import axios from 'axios';
// import { HEROES_DATA } from '../src/data/heroesData';

// const prisma = new PrismaClient();
// const API_URL = 'https://overfast-api.tekrop.fr';

// async function main() {
//   console.log('🚀 Iniciando actualización de la base de datos...');

//   // 1. Descargar lista base de la API (para tener IDs externos si se necesitan)
//   console.log('📥 Consultando API para referencias...');
//   let apiHeroes: any[] = [];
//   try {
//     const response = await axios.get(`${API_URL}/heroes`);
//     apiHeroes = response.data;
//   } catch (error) {
//     console.warn("⚠️ La API falló. Se usarán solo datos locales.");
//   }

//   // 2. Recorremos NUESTRO diccionario local (la fuente de la verdad)
//   for (const [heroName, staticData] of Object.entries(HEROES_DATA)) {
//     console.log(`\n---------------------------------`);
//     console.log(`🦸 Procesando: ${heroName}`);

//     // Buscamos la "key" de la API para intentar bajar habilidades
//     const apiKeyObj = apiHeroes.find((h: any) => h.name === heroName);
//     const heroKey = apiKeyObj ? apiKeyObj.key : null;

//     // --- AQUÍ OCURRE LA MAGIA DEL UPSERT ---
//     const hero = await prisma.heroes.upsert({
//       where: { hero_name: heroName }, // Buscamos por nombre
//       // Si no existe, CREAMOS todo
//       create: {
//         hero_name: heroName,
//         role: staticData.role,
//         launch_year: staticData.year,
//         gender: staticData.gender,
//         species: staticData.species,
//         image_url: `/assets/heroes/${staticData.image}`, // Guardamos la ruta para el frontend
//       },
//       // Si ya existe, ACTUALIZAMOS los datos nuevos
//       update: {
//         launch_year: staticData.year,
//         role: staticData.role,
//         gender: staticData.gender,
//         species: staticData.species,
//         image_url: `/assets/heroes/${staticData.image}`,
//       },
//     });

//     console.log(`   ✨ Héroe actualizado/creado: ${hero.hero_name} (ID: ${hero.hero_id})`);

//     // Insertar Frases y Skins (Esto sigue igual, Prisma las crea si no existen)
//     // ... (puedes dejar el resto de tu lógica de skins y frases aquí)
//   }

//   console.log('\n🏁 Base de datos actualizada con éxito.');
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });

import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import { HEROES_DATA } from '../src/data/heroesData';

const prisma = new PrismaClient();
const API_URL = 'https://overfast-api.tekrop.fr';

async function main() {
  console.log('🚀 Iniciando Super-Seeding Híbrido...');

  // 1. Obtener lista de la API para saber las "claves" correctas (ej: "soldier-76")
  let apiHeroesMap = new Map();
  try {
    console.log('🌐 Conectando con Overfast API para obtener referencias...');
    const response = await axios.get(`${API_URL}/heroes`);
    // Creamos un mapa para buscar rápido: "Soldier: 76" -> "soldier-76"
    response.data.forEach((h: any) => apiHeroesMap.set(h.name, h.key));
  } catch (error) {
    console.warn("⚠️ No se pudo conectar a la API general. Solo se usarán datos locales.");
  }

  // 2. Recorremos TU archivo local (La fuente de la verdad)
  for (const [heroName, staticData] of Object.entries(HEROES_DATA)) {
    console.log(`\n---------------------------------`);
    console.log(`🦸 Procesando: ${heroName}`);

    // --- A. CREAR O ACTUALIZAR HÉROE ---
    const hero = await prisma.heroes.upsert({
      where: { hero_name: heroName },
      create: {
        hero_name: heroName,
        role: staticData.role,
        launch_year: staticData.year,
        gender: staticData.gender,
        species: staticData.species,
        image_url: `/assets/heroes/${staticData.image}`,
      },
      update: {
        launch_year: staticData.year,
        role: staticData.role,
        gender: staticData.gender,
        species: staticData.species,
        image_url: `/assets/heroes/${staticData.image}`,
      },
    });

    // --- B. GESTIÓN DE SKINS (SEGURO CLASSIC + LOCALES) ---
    const skinsToInsert = [];
    
    // B.1 Siempre agregamos la skin "Classic"
    skinsToInsert.push({ name: "Classic", rarity: "Common" });

    // B.2 Agregamos las skins de tu archivo heroesData
    if (staticData.skins) {
        staticData.skins.forEach(s => skinsToInsert.push({ name: s, rarity: "Epic" }));
    }

    for (const skinData of skinsToInsert) {
        // Verificamos si existe para no duplicar
        const existingSkin = await prisma.skins.findFirst({
            where: { skin_name: skinData.name, hero_id: hero.hero_id }
        });

        if (!existingSkin) {
            await prisma.skins.create({
                data: {
                    skin_name: skinData.name,
                    rarity: skinData.rarity,
                    hero_id: hero.hero_id
                }
            });
        }
    }
    console.log(`   👕 Skins procesadas (Incluyendo Classic).`);


    // --- C. GESTIÓN DE FRASES (LOCALES) ---
    if (staticData.phrase) {
        const existingPhrase = await prisma.phrases.findFirst({
            where: { phrase_text: staticData.phrase, hero_id: hero.hero_id }
        });
        if (!existingPhrase) {
            await prisma.phrases.create({
                data: {
                    phrase_text: staticData.phrase,
                    hero_id: hero.hero_id,
                    audio_url: null 
                }
            });
        }
        console.log(`   💬 Frase guardada.`);
    }


    // --- D. GESTIÓN DE HABILIDADES (DESDE API) ---
    // Aquí es donde la API nos salva porque no tienes habilidades en tu archivo local.
    
    const heroKey = apiHeroesMap.get(heroName); // Buscamos la clave (ej: "Wrecking Ball" -> "wrecking-ball")
    
    if (heroKey) {
        try {
            // Pedimos las habilidades específicas de este héroe
            const abilitiesRes = await axios.get(`${API_URL}/heroes/${heroKey}`);
            const abilitiesData = abilitiesRes.data.abilities;

            for (const ability of abilitiesData) {
                // Verificar si ya existe
                const existingAbility = await prisma.abilities.findFirst({
                    where: { ability_name: ability.name, hero_id: hero.hero_id }
                });

                if (!existingAbility) {
                    await prisma.abilities.create({
                        data: {
                            ability_name: ability.name,
                            icon_url: ability.icon, // La API nos da la URL del icono
                            hero_id: hero.hero_id
                        }
                    });
                }
            }
            console.log(`   ✨ ${abilitiesData.length} Habilidades descargadas de la API.`);
        } catch (e) {
            console.error(`   ⚠️ Error descargando habilidades para ${heroName}. Quizás es un héroe nuevo (Hazard/Freja) que la API aún no tiene.`);
        }
    } else {
        console.log(`   ⚠️ No se encontró clave de API para ${heroName} (Probablemente es custom o muy nuevo).`);
    }
  }

  console.log('\n🏁 Base de datos actualizada con éxito.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });