// VERSIÓN: Conectada a Base de Datos (Sin Mock Data)
// FECHA: Actualizado para leer historial real del usuario
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
// Asegúrate de que esta ruta coincida con donde tienes tu UserContext.
// Si está en src/context, esta ruta ../../context es correcta desde src/app/archive
import { useUser } from '../../context/UserContext'; 
import './archive.css';

// Si no tienes instalada esta librería, recuerda correr: npm install react-icons
import { IoCheckmarkCircle, IoCloseCircle, IoHelpCircle } from "react-icons/io5";

type ArchiveItem = {
  date: string;
  status: 'won' | 'lost' | 'unplayed';
  hero_image?: string | null;
  attempts: number;
};

export default function ArchivePage() {
  const [archiveData, setArchiveData] = useState<ArchiveItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { user, setGameDate } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Si no hay usuario, no podemos cargar historial personal
    if (!user) {
        setLoading(false);
        return;
    }

    // --- CONEXIÓN REAL AL BACKEND ---
    // Llamamos al endpoint que creamos en index.ts para obtener el historial
    fetch(`http://localhost:3001/api/archive?userId=${user.user_id}`)
        .then(res => {
            if (!res.ok) throw new Error("Error en red al obtener archivo");
            return res.json();
        })
        .then(data => {
            setArchiveData(data);
            setLoading(false);
        })
        .catch(err => {
            console.error("Error cargando archivo:", err);
            setLoading(false);
        });

  }, [user]);

  const handleSelectDate = (dateStr: string) => {
    const selectedDate = new Date(dateStr);
    
    // 1. "Viaje en el Tiempo": Actualizamos la fecha en el contexto global
    setGameDate(selectedDate);
    
    // 2. Redirigimos al Home (o ruta '/') para jugar el puzzle de ESA fecha
    router.push('/'); 
  };

  if (loading) return <div className="archive-loading">Cargando la memoria de Winston...</div>;

  return (
    <div className="archive-container">
      <h1 className="archive-title">Archivo de Misiones</h1>
      
      {!user ? (
        <div style={{marginTop: 50}}>
            <p className="archive-subtitle">Debes iniciar sesión para ver tu historial de misiones.</p>
        </div>
      ) : (
        <>
            <div className="archive-legend">
                <div className="legend-item"><span className="dot won"></span> Misión Cumplida</div>
                <div className="legend-item"><span className="dot lost"></span> Misión Fallida</div>
                <div className="legend-item"><span className="dot unplayed"></span> Pendiente</div>
            </div>

            {archiveData.length === 0 ? (
                <div style={{ marginTop: 30, opacity: 0.8 }}>
                    <p>No hay misiones registradas aún en la base de datos.</p>
                    <small>¡Juega tu primera partida hoy para empezar a llenar el archivo!</small>
                </div>
            ) : (
                <div className="archive-grid">
                    {archiveData.map((item, index) => {
                        const dateObj = new Date(item.date);
                        const day = dateObj.getDate();
                        const month = dateObj.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase();
                        
                        return (
                            <div 
                                key={index} 
                                className={`day-card ${item.status === 'lost' ? 'played-lost' : item.status}`}
                                onClick={() => handleSelectDate(item.date)}
                                title={`Jugar fecha: ${dateObj.toLocaleDateString()}`}
                            >
                                {/* Imagen de fondo (Solo se muestra si ganó para evitar spoilers) */}
                                {item.status === 'won' && item.hero_image && (
                                    <div className="hero-preview-wrapper">
                                        {/* Usamos img estándar para evitar problemas de configuración de dominios externos */}
                                        <img src={item.hero_image} alt="Hero" className="hero-preview" />
                                    </div>
                                )}

                                <div className="card-content">
                                    <span className="date-number">{day}</span>
                                    <span className="date-month">{month}</span>
                                    
                                    <div className="status-icon">
                                        {item.status === 'won' && <IoCheckmarkCircle className="icon-won" />}
                                        {item.status === 'lost' && <IoCloseCircle className="icon-lost" />}
                                        {item.status === 'unplayed' && <IoHelpCircle className="icon-pending" />}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </>
      )}
    </div>
  );
}