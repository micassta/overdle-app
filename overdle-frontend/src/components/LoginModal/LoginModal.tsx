import React, { useState } from 'react';
import './LoginModal.css';
import { IoClose, IoPerson, IoLogOut } from 'react-icons/io5';
import { useUser } from '../../context/UserContext'; 

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const [usernameInput, setUsernameInput] = useState('');
  const [error, setError] = useState('');
  
  const { user, login, logout } = useUser();

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = await login(usernameInput);
    
    if (success) {
        onClose();
        setUsernameInput('');
    } else {
        setError("Error: No se pudo conectar o el nombre es inválido.");
    }
  };

  const handleLogout = () => {
    logout();
    onClose();
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
                    
                    {error && <p style={{ color: '#ff5c5c', fontSize: '0.9rem', marginTop: '5px' }}>{error}</p>}

                    <button type="submit" className="login-submit-btn">
                        Entrar / Registrarse
                    </button>
                </form>
            </>
        )}
      </div>
    </div>
  );
};