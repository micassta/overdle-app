// VERSIÓN: Con Soporte Visual para "En Progreso"
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../../context/UserContext'; 
import './archive.css';
// Importamos el ícono de reloj (IoTime)
import { IoCheckmarkCircle, IoCloseCircle, IoHelpCircle, IoTime } from "react-icons/io5";

type ArchiveItem = {
  date: string;
  status: 'won' | 'lost' | 'in_progress' | 'unplayed'; // Añadimos in_progress al tipo
  hero_image?: string | null;
  attempts: number;
};

export default function ArchivePage() {
  const [archiveData, setArchiveData] = useState<ArchiveItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { user, setGameDate } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
        setLoading(false);
        return;
    }

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
    setGameDate(selectedDate);
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
                <div className="legend-item"><span className="dot won"></span> Completada</div>
                <div className="legend-item"><span className="dot lost"></span> Fallida</div>
                <div className="legend-item"><span className="dot in_progress"></span> En Progreso</div>
                <div className="legend-item"><span className="dot unplayed"></span> Pendiente</div>
            </div>

            {archiveData.length === 0 ? (
                <div style={{ marginTop: 30, opacity: 0.8 }}>
                    <p>No hay misiones registradas aún.</p>
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
                                {/* Imagen de fondo (Solo si ganó, para evitar spoilers) */}
                                {item.status === 'won' && item.hero_image && (
                                    <div className="hero-preview-wrapper">
                                        <img src={item.hero_image} alt="Hero" className="hero-preview" />
                                    </div>
                                )}

                                <div className="card-content">
                                    <span className="date-number">{day}</span>
                                    <span className="date-month">{month}</span>
                                    
                                    <div className="status-icon">
                                        {item.status === 'won' && <IoCheckmarkCircle className="icon-won" />}
                                        {item.status === 'lost' && <IoCloseCircle className="icon-lost" />}
                                        {/* Nuevo Ícono para En Progreso */}
                                        {item.status === 'in_progress' && <IoTime className="icon-progress" />}
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