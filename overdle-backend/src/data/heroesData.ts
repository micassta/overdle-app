// Tipado actualizado para incluir los datos del modo clásico
export const HEROES_DATA: Record<string, { 
  year: number; 
  role: string; 
  gender: string;
  species: string;
  image: string; // Nombre del archivo en /public/assets/heroes/
  phrase: string; 
  skins: string[] 
}> = {

  "Hazard": { 
    year: 2024, role: "Tank", gender: "Male", species: "Human", image: "hazard.png",
    phrase: "¡Cuidado conmigo!", skins: ["Phreak", "Ciber-Punk"] 
  },
  "Freja": { 
    year: 2025, role: "Damage", gender: "Female", species: "Human", image: "freja.png",
    phrase: "La caza comienza.", skins: ["Cazarrecompensas", "Vikinga"] 
  },
  "Wuyang": { 
    year: 2025, role: "Support", gender: "Male", species: "Human", image: "wuyang.png",
    phrase: "El flujo lo es todo.", skins: ["Dinastía", "Jade"] 
  },

  // --- TANKs ---
  "D.Va": { year: 2016, role: "Tank", gender: "Female", species: "Human", image: "dva.png", phrase: "¡Nerfea esto!", skins: ["Academia", "Nano"] },
  "Doomfist": { year: 2017, role: "Tank", gender: "Male", species: "Human", image: "doomfist.png", phrase: "Solo a través del conflicto evolucionamos.", skins: ["Formal", "Cosa del Pantano"] },
  "Junker Queen": { year: 2022, role: "Tank", gender: "Female", species: "Human", image: "junker-queen.png", phrase: "¡Hora del ajuste de cuentas!", skins: ["Verdugo", "Zeus"] },
  "Mauga": { year: 2023, role: "Tank", gender: "Male", species: "Human", image: "mauga.png", phrase: "¡Nunca es aburrido por aquí!", skins: ["Fiesta", "Magma"] },
  "Orisa": { year: 2017, role: "Tank", gender: "Female", species: "Omnic", image: "orisa.png", phrase: "Tu seguridad es mi preocupación.", skins: ["Demonio", "Bosque"] },
  "Ramattra": { year: 2022, role: "Tank", gender: "Male", species: "Omnic", image: "ramattra.png", phrase: "Sufran como yo he sufrido.", skins: ["Nigromante", "Monje"] },
  "Reinhardt": { year: 2016, role: "Tank", gender: "Male", species: "Human", image: "reinhardt.png", phrase: "¡El honor y la gloria!", skins: ["Balderich", "Conductor"] },
  "Roadhog": { year: 2016, role: "Tank", gender: "Male", species: "Human", image: "roadhog.png", phrase: "Soy un apocalipsis de un solo hombre.", skins: ["Carnicero", "Isleño"] },
  "Sigma": { year: 2019, role: "Tank", gender: "Male", species: "Human", image: "sigma.png", phrase: "¡La melodía canta para mí!", skins: ["Asilo", "Maestro"] },
  "Winston": { year: 2016, role: "Tank", gender: "Male", species: "Animal", image: "winston.png", phrase: "La imaginación es la esencia.", skins: ["Yeti", "Gárgola"] },
  "Wrecking Ball": { year: 2018, role: "Tank", gender: "Male", species: "Animal", image: "wrecking-ball.png", phrase: "El hámster huele tu miedo.", skins: ["Horizonte", "Calabaza"] },
  "Zarya": { year: 2016, role: "Tank", gender: "Female", species: "Human", image: "zarya.png", phrase: "Juntos somos fuertes.", skins: ["Ciberian", "Bárbara"] },

  // --- DPS ---
  "Ashe": { year: 2018, role: "Damage", gender: "Female", species: "Human", image: "ashe.png", phrase: "¡B.O.B., haz algo!", skins: ["Socialité", "Bruja"] },
  "Bastion": { year: 2016, role: "Damage", gender: "N/A", species: "Omnic", image: "bastion.png", phrase: "Doo-woo-woo-woo!", skins: ["Gwishin", "Lego"] },
  "Cassidy": { year: 2016, role: "Damage", gender: "Male", species: "Human", image: "cassidy.png", phrase: "Es la hora de la verdad.", skins: ["Van Helsing", "Salvavidas"] },
  "Echo": { year: 2020, role: "Damage", gender: "Female", species: "Omnic", image: "echo.png", phrase: "Adaptabilidad es la clave.", skins: ["Mariposa", "Sigilo"] },
  "Genji": { year: 2016, role: "Damage", gender: "Male", species: "Human", image: "genji.png", phrase: "Ryūjin no ken wo kurae!", skins: ["Oni", "Sentai"] },
  "Hanzo": { year: 2016, role: "Damage", gender: "Male", species: "Human", image: "hanzo.png", phrase: "Ryū ga waga teki wo kurau!", skins: ["Lobo Solitario", "Okami"] },
  "Junkrat": { year: 2016, role: "Damage", gender: "Male", species: "Human", image: "junkrat.png", phrase: "¡Es un día perfecto para el caos!", skins: ["Dr. Junkenstein", "Bufón"] },
  "Mei": { year: 2016, role: "Damage", gender: "Female", species: "Human", image: "mei.png", phrase: "¡Este mundo vale la pena!", skins: ["Pijama", "Bombera"] },
  "Pharah": { year: 2016, role: "Damage", gender: "Female", species: "Human", image: "pharah.png", phrase: "La justicia llueve desde arriba.", skins: ["Mechaqueen", "Aviadora"] },
  "Reaper": { year: 2016, role: "Damage", gender: "Male", species: "Human", image: "reaper.png", phrase: "¡Muere, muere, muere!", skins: ["Mariachi", "Cuervo"] },
  "Sojourn": { year: 2022, role: "Damage", gender: "Female", species: "Human", image: "sojourn.png", phrase: "Terminemos con esto.", skins: ["Comando", "Ciber-Detective"] },
  "Soldier: 76": { year: 2016, role: "Damage", gender: "Male", species: "Human", image: "soldier-76.png", phrase: "Te tengo en la mira.", skins: ["Parrillero", "Cyborg"] },
  "Sombra": { year: 2016, role: "Damage", gender: "Female", species: "Human", image: "sombra.png", phrase: "¡Apagando las luces!", skins: ["Ciberespacio", "Los Muertos"] },
  "Symmetra": { year: 2016, role: "Damage", gender: "Female", species: "Human", image: "symmetra.png", phrase: "La realidad se dobla a mi voluntad.", skins: ["Diosa", "Dragona"] },
  "Torbjörn": { year: 2016, role: "Damage", gender: "Male", species: "Human", image: "torbjorn.png", phrase: "¡Construyendo torreta!", skins: ["Barbarroja", "Magni"] },
  "Tracer": { year: 2016, role: "Damage", gender: "Female", species: "Human", image: "tracer.png", phrase: "¡No te preocupes, cariño!", skins: ["Grafiti", "Atletismo"] },
  "Venture": { year: 2024, role: "Damage", gender: "NB", species: "Human", image: "venture.png", phrase: "¡Puedo excavar eso!", skins: ["Topadora", "Monarca"] },
  "Widowmaker": { year: 2016, role: "Damage", gender: "Female", species: "Human", image: "widowmaker.png", phrase: "Nadie escapa de mi mira.", skins: ["Cazadora", "Condesa"] },

  // --- SUPPORTS ---
  "Ana": { year: 2016, role: "Support", gender: "Female", species: "Human", image: "ana.png", phrase: "Los adultos están hablando.", skins: ["Capitana Amari", "Cabana"] },
  "Baptiste": { year: 2019, role: "Support", gender: "Male", species: "Human", image: "baptiste.png", phrase: "Nadie muere bajo mi guardia.", skins: ["Especuladora", "Pirata"] },
  "Brigitte": { year: 2018, role: "Support", gender: "Female", species: "Human", image: "brigitte.png", phrase: "¡A mí!", skins: ["Doncella", "Mecánica"] },
  "Illari": { year: 2023, role: "Support", gender: "Female", species: "Human", image: "illari.png", phrase: "Enfréntate al amanecer.", skins: ["Llama", "Pijama"] },
  "Juno": { year: 2024, role: "Support", gender: "Female", species: "Human", image: "juno.png", phrase: "¡Despegue!", skins: ["Astronauta", "Orbital"] },
  "Kiriko": { year: 2022, role: "Support", gender: "Female", species: "Human", image: "kiriko.png", phrase: "Deja que el Kitsune te guíe.", skins: ["Hinotori", "Bruja"] },
  "Lifeweaver": { year: 2023, role: "Support", gender: "Male", species: "Human", image: "lifeweaver.png", phrase: "La vida protege a la vida.", skins: ["Loto", "Clérigo"] },
  "Lúcio": { year: 2016, role: "Support", gender: "Male", species: "Human", image: "lucio.png", phrase: "¡Vamos a romperla!", skins: ["Jazzy", "Ribbit"] },
  "Mercy": { year: 2016, role: "Support", gender: "Female", species: "Human", image: "mercy.png", phrase: "¡Los héroes nunca mueren!", skins: ["Diablesa", "Valquiria"] },
  "Moira": { year: 2017, role: "Support", gender: "Female", species: "Human", image: "moira.png", phrase: "La ciencia revelará la verdad.", skins: ["Banshee", "Científica"] },
  "Zenyatta": { year: 2016, role: "Support", gender: "Male", species: "Omnic", image: "zenyatta.png", phrase: "Experimenta la tranquilidad.", skins: ["Cultista", "Ra"] },
};