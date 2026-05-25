import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post('http://localhost:8888/.netlify/functions/register', {
        name,
        email,
        password
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao cadastrar');
    } finally {
      setLoading(false);
    }
  };

  const styles = `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif;
      background: linear-gradient(135deg, #f5f5f7 0%, #ffffff 100%);
      color: #1d1d1f;
      -webkit-font-smoothing: antialiased;
    }

    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
      padding: 1.5rem;
    }

    .auth-background {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: 
        radial-gradient(circle at 20% 50%, rgba(0, 113, 227, 0.05) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(52, 199, 89, 0.05) 0%, transparent 50%);
      pointer-events: none;
    }

    .auth-wrapper {
      position: relative;
      z-index: 10;
      width: 100%;
      max-width: 400px;
    }

    .auth-card {
      background: #ffffff;
      border: 1px solid #e5e5e7;
      border-radius: 1.25rem;
      padding: 2.5rem;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
      animation: slideUp 250ms ease-out;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .auth-header {
      text-align: center;
      margin-bottom: 2.5rem;
    }

    .auth-logo {
      font-size: 3rem;
      margin-bottom: 1.5rem;
      display: block;
      animation: float 3s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-8px);
      }
    }

    .auth-header h1 {
      font-size: 1.5625rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, #0071e3, #0077ed);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .auth-header p {
      font-size: 0.9375rem;
      color: #86868b;
      font-weight: 500;
    }

    .alert {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1rem 1.5rem;
      border-radius: 0.75rem;
      margin-bottom: 2rem;
      font-size: 0.9375rem;
      animation: slideDown 250ms ease-out;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .alert-error {
      background-color: rgba(255, 59, 48, 0.1);
      color: #d70015;
      border: 1px solid rgba(255, 59, 48, 0.2);
    }

    .alert-icon {
      font-size: 1.25rem;
      flex-shrink: 0;
      line-height: 1;
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-group label {
      font-size: 0.9375rem;
      font-weight: 600;
      color: #1d1d1f;
    }

    .form-input {
      padding: 1.5rem;
      border: 1px solid #e5e5e7;
      border-radius: 0.75rem;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif;
      font-size: 1rem;
      color: #1d1d1f;
      background-color: #f5f5f7;
      transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
      outline: none;
    }

    .form-input::placeholder {
      color: #a1a1a6;
    }

    .form-input:focus {
      border-color: #0071e3;
      background-color: #ffffff;
      box-shadow: 0 0 0 3px rgba(0, 113, 227, 0.1);
    }

    .form-hint {
      font-size: 0.8125rem;
      color: #86868b;
      font-weight: 400;
      margin-top: 0.25rem;
    }

    .btn {
      padding: 0.875rem 2rem;
      border: none;
      border-radius: 0.75rem;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      outline: none;
      width: 100%;
      min-height: 48px;
    }

    .btn-primary {
      background-color: #0071e3;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #0077ed;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }

    .btn-primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .spinner {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    .divider {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin: 2rem 0;
      color: #a1a1a6;
      font-size: 0.9375rem;
    }

    .divider::before,
    .divider::after {
      content: '';
      flex: 1;
      height: 1px;
      background-color: #e5e5e7;
    }

    .auth-footer {
      text-align: center;
    }

    .auth-footer p {
      font-size: 0.9375rem;
      color: #86868b;
      margin-bottom: 0.5rem;
    }

    .auth-link {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      color: #0071e3;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.9375rem;
      transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
    }

    .auth-link:hover {
      color: #0077ed;
    }

    .link-icon {
      display: inline-block;
      transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1);
    }

    .auth-link:hover .link-icon {
      transform: translateX(4px);
    }

    .success-state {
      text-align: center;
      padding: 2rem 0;
      animation: fadeIn 250ms ease-out;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .success-icon {
      width: 80px;
      height: 80px;
      margin: 0 auto 2rem;
      background: linear-gradient(135deg, #34c759, #31a14e);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2.5rem;
      color: white;
      animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    @keyframes scaleIn {
      from {
        transform: scale(0);
        opacity: 0;
      }
      to {
        transform: scale(1);
        opacity: 1;
      }
    }

    .success-state h2 {
      font-size: 1.125rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      color: #1d1d1f;
    }

    .success-state p {
      font-size: 0.9375rem;
      color: #86868b;
      margin-bottom: 1rem;
    }

    .success-subtext {
      font-size: 0.8125rem !important;
      color: #a1a1a6 !important;
      margin-top: 2rem !important;
    }

    .success-spinner {
      width: 24px;
      height: 24px;
      border: 2px solid rgba(0, 113, 227, 0.2);
      border-top-color: #0071e3;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 2rem auto 0;
    }

    .auth-decoration {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      pointer-events: none;
      z-index: 0;
    }

    .decoration-circle {
      position: absolute;
      border-radius: 50%;
      opacity: 0.05;
      pointer-events: none;
    }

    .decoration-1 {
      width: 300px;
      height: 300px;
      background: #0071e3;
      top: -100px;
      right: -100px;
      animation: float 8s ease-in-out infinite;
    }

    .decoration-2 {
      width: 200px;
      height: 200px;
      background: #34c759;
      bottom: -50px;
      left: -50px;
      animation: float 6s ease-in-out infinite 1s;
    }

    .decoration-3 {
      width: 150px;
      height: 150px;
      background: #0071e3;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      animation: float 10s ease-in-out infinite 2s;
    }

    @media (max-width: 480px) {
      .auth-card {
        padding: 2rem;
      }

      .auth-logo {
        font-size: 2.5rem;
      }

      .auth-header h1 {
        font-size: 1.3125rem;
      }

      .decoration-1 {
        width: 200px;
        height: 200px;
        top: -80px;
        right: -80px;
      }

      .decoration-2 {
        width: 150px;
        height: 150px;
        bottom: -40px;
        left: -40px;
      }

      .decoration-3 {
        width: 100px;
        height: 100px;
      }
    }
  `;

  if (success) {
    return (
      <>
        <style>{styles}</style>
        <div className="auth-container">
          <div className="auth-background"></div>
          
          <div className="auth-wrapper">
            <div className="auth-card">
              <div className="success-state">
                <div className="success-icon">✓</div>
                <h2>Cadastro Realizado!</h2>
                <p>Sua conta foi criada com sucesso.</p>
                <p className="success-subtext">Redirecionando para o login...</p>
                <div className="success-spinner"></div>
              </div>
            </div>

            <div className="auth-decoration">
              <div className="decoration-circle decoration-1"></div>
              <div className="decoration-circle decoration-2"></div>
              <div className="decoration-circle decoration-3"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="auth-container">
        <div className="auth-background"></div>
        
        <div className="auth-wrapper">
          <div className="auth-card">
            <div className="auth-header">
              <div className="auth-logo">📋</div>
              <h1>Criar Conta</h1>
              <p>Junte-se a nós e comece a organizar</p>
            </div>

            {error && (
              <div className="alert alert-error">
                <span className="alert-icon">⚠️</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="name">Nome Completo</label>
                <input
                  id="name"
                  type="text"
                  placeholder="João Silva"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="form-input"
                  autoComplete="name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="seu.email@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="form-input"
                  autoComplete="email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Senha</label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="form-input"
                  autoComplete="new-password"
                  minLength="6"
                />
                <p className="form-hint">Mínimo 6 caracteres</p>
              </div>

              <button 
                type="submit" 
                disabled={loading} 
                className="btn btn-primary"
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Cadastrando...
                  </>
                ) : (
                  'Criar Conta'
                )}
              </button>
            </form>

            <div className="divider">
              <span>ou</span>
            </div>

            <div className="auth-footer">
              <p>Já tem conta?</p>
              <Link to="/login" className="auth-link">
                Faça login agora
                <span className="link-icon">→</span>
              </Link>
            </div>
          </div>

          <div className="auth-decoration">
            <div className="decoration-circle decoration-1"></div>
            <div className="decoration-circle decoration-2"></div>
            <div className="decoration-circle decoration-3"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;