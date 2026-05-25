import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:8888/.netlify/functions/login', {
        email,
        password
      });

      login(response.data.token, response.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: '100%', padding: '10px', margin: '10px 0' }}
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: '100%', padding: '10px', margin: '10px 0' }}
        />
        <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px' }}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <p style={{ marginTop: '15px' }}>
        Não tem conta? <Link to="/register">Cadastre-se</Link>
      </p>
    </div>
  );
};

export default Login;