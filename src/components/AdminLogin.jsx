import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { Eye, EyeOff, LockKeyhole, Mail, X } from 'lucide-react'
import { auth } from '../config/firebase'
import '../styles/AdminLogin.css'

export default function AdminLogin({ onLoginSuccess, onClose }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)

      if (userCredential.user) {
        onLoginSuccess(userCredential.user)
        setEmail('')
        setPassword('')
      }
    } catch (err) {
      console.error('Error de login:', err)
      if (err.code === 'auth/invalid-credential') {
        setError('Email o contraseña incorrectos')
      } else if (err.code === 'auth/user-not-found') {
        setError('Usuario no encontrado')
      } else {
        setError('Error al iniciar sesión')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login-overlay" onClick={onClose}>
      <div className="admin-login-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose} aria-label="Cerrar acceso administrador">
          <X size={20} />
        </button>

        <div className="admin-login-container">
          <div className="admin-login-badge">
            <LockKeyhole size={22} />
          </div>
          <h2>Panel administrativo</h2>
          <p className="subtitle">Gestiona agenda, pacientes, sesiones y notas clínicas desde un solo lugar.</p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email</label>
              <div className="admin-login-input">
                <Mail size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-label="Correo electrónico"
                  autoComplete="username"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Contraseña</label>
              <div className="admin-login-input">
                <LockKeyhole size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-label="Contraseña"
                  autoComplete="current-password"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-visibility-btn"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? 'Iniciando sesión...' : 'Acceder'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
