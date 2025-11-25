// VERSIÓN: Con Feedback de Usuario (Nuevo vs Existente)
// FECHA: Muestra alertas visuales según el tipo de login
import React, { useState } from 'react';
import './LoginModal.css';

// Si no tienes react-icons, puedes borrar esta línea y usar texto simple en el botón
import { IoClose, IoPerson, IoLogOut, IoInformationCircle } from 'react-icons/io5';

// Ajusta la ruta si UserContext está en otro lugar
import { useUser } from '../../context/UserContext'; 

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const [usernameInput, setUsernameInput] = useState('');
  const [statusMessage, setStatusMessage] = useState<{type: 'error' | 'success' | 'info', text: string} | null>(null);
  
  const { user, login, logout } = useUser();

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    
    // Llamamos al login del contexto
    const result = await login(usernameInput);
    
    if (result.success) {
        // Lógica de mensajes
        if (result.isNew) {
            setStatusMessage({ type: 'success', text: '¡Cuenta creada! Bienvenido.' });
        } else {
            setStatusMessage({ type: 'info', text: `¡Bienvenido de nuevo, ${usernameInput}!` });
        }

        // Cerramos el modal después de 1.5 segundos para que lean el mensaje
        setTimeout(() => {
            onClose();
            setUsernameInput('');
            setStatusMessage(null);
        }, 1500);

    } else {
        setStatusMessage({ type: 'error', text: result.message || "Error al conectar." });
    }
  };

  const handleLogout = () => {
    logout();
    setStatusMessage(null); // Limpiamos mensajes al salir
    // No cerramos el modal inmediatamente para que vea que salió, o sí, depende tu gusto.
    // onClose(); 
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content login-modal">
        <button className="close-button" onClick={onClose}>
          <IoClose size={30} />
        </button>

        {user ? (
            <div className="login-header">
                <div className="icon-circle" style={{ background: '#1c9e43' }}>
                    <IoPerson size={40} color="#fff" />
                </div>
                <h2>¡Hola, {user.username}!</h2>
                <p>Sesión activa.</p>
                
                <div style={{ marginTop: 20 }}>
                    <button onClick={handleLogout} className="logout-btn">
                        <IoLogOut style={{ marginRight: 5 }}/> Cerrar Sesión
                    </button>
                </div>
            </div>
        ) : (
            <>
                <div className="login-header">
                    <div className="icon-circle">
                        <IoPerson size={40} color="#fff" />
                    </div>
                    <h2>Identifícate</h2>
                    <p>Ingresa tu nombre para guardar progreso.</p>
                </div>

                <form onSubmit={handleLogin} className="login-form">
                    <label>Nombre de Usuario</label>
                    <input 
                        type="text" 
                        placeholder="Ej. TracerMain123" 
                        value={usernameInput}
                        onChange={(e) => setUsernameInput(e.target.value)}
                        className="login-input"
                        required
                        minLength={3}
                    />
                    
                    {/* MENSAJES DE ESTADO (Feedback) */}
                    {statusMessage && (
                        <div style={{ 
                            marginTop: 10, 
                            padding: 10, 
                            borderRadius: 5,
                            fontSize: '0.9rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 5,
                            backgroundColor: statusMessage.type === 'error' ? 'rgba(255, 92, 92, 0.2)' : 
                                             statusMessage.type === 'success' ? 'rgba(28, 158, 67, 0.2)' : 
                                             'rgba(250, 156, 30, 0.2)', // Info (Naranja)
                            color: statusMessage.type === 'error' ? '#ff5c5c' : 
                                   statusMessage.type === 'success' ? '#4ef07e' : 
                                   '#FA9C1E'
                        }}>
                           <IoInformationCircle /> {statusMessage.text}
                        </div>
                    )}

                    <button type="submit" className="login-submit-btn">
                        Entrar
                    </button>
                </form>
            </>
        )}
      </div>
    </div>
  );
};