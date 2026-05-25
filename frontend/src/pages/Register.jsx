import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

      alert('Cadastro realizado com sucesso! Faça login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao cadastrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h2>Cadastro</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ width: '100%', padding: '10px', margin: '10px 0' }}
        />
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
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </button>
      </form>

      <p style={{ marginTop: '15px' }}>
        Já tem conta? <Link to="/login">Faça login</Link>
      </p>
    </div>
  );
};

export default Register;