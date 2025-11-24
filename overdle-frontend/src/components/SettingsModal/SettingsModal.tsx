"use client";

import React from 'react';
import './SettingsModal.css';
import { IoClose } from "react-icons/io5"; // Ícono para cerrar

// Definimos las props que recibirá: si está abierto y la función para cerrarlo
type SettingsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      {/* 2. e.stopPropagation() requiere interactividad del cliente */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Configuración</h2>
          <button onClick={onClose} className="close-button">
            <IoClose size={24} />
          </button>
        </div>
        <div className="modal-body">
          <p>Configuración del juego...</p>
        </div>
      </div>
    </div>
  );
};

// export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
//   // Si no está abierto, no renderizamos nada
//   if (!isOpen) {
//     return null;
//   }

//   return (
//     // El "backdrop" es el fondo oscuro semitransparente
//     <div className="modal-backdrop" onClick={onClose}>
//       {/* Detenemos la propagación para que al hacer clic DENTRO del modal, no se cierre */}
//       <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//         <div className="modal-header">
//           <h2>Configuración</h2>
//           <button onClick={onClose} className="close-button">
//             <IoClose size={24} />
//           </button>
//         </div>
//         <div className="modal-body">
//           <p>Aquí irían las opciones de configuración del juego...si tuviera alguna...</p>
//         </div>
//       </div>
//     </div>
//   );
// };