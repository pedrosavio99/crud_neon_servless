import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Carregar itens ao entrar
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:8888/.netlify/functions/read-items');
      setItems(response.data.items);
    } catch (err) {
      setError('Erro ao carregar itens');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        // Atualizar
        await axios.put('http://localhost:8888/.netlify/functions/update-item', {
          id: editingId,
          title,
          description
        });
      } else {
        // Criar novo
        await axios.post('http://localhost:8888/.netlify/functions/create-item', {
          title,
          description
        });
      }

      setTitle('');
      setDescription('');
      setEditingId(null);
      fetchItems(); // Atualizar lista
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao salvar item');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setTitle(item.title);
    setDescription(item.description || '');
    setEditingId(item.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deseja realmente excluir este item?')) return;

    try {
      await axios.delete('http://localhost:8888/.netlify/functions/delete-item', {
        data: { id }
      });
      fetchItems();
    } catch (err) {
      setError('Erro ao deletar item');
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '30px auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Bem-vindo, {user?.name}!</h2>
        <button onClick={logout} style={{ padding: '8px 16px' }}>
          Sair
        </button>
      </div>

      <h3>Meus Itens</h3>

      {/* Formulário */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ width: '100%', padding: '10px', margin: '8px 0' }}
        />
        <textarea
          placeholder="Descrição (opcional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ width: '100%', padding: '10px', margin: '8px 0', minHeight: '80px' }}
        />
        <button type="submit" disabled={loading} style={{ padding: '12px 20px' }}>
          {editingId ? 'Atualizar Item' : 'Adicionar Item'}
        </button>
        {editingId && (
          <button type="button" onClick={() => { setEditingId(null); setTitle(''); setDescription(''); }}>
            Cancelar
          </button>
        )}
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Lista de Itens */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {items.map(item => (
          <li key={item.id} style={{ 
            padding: '15px', 
            margin: '10px 0', 
            border: '1px solid #ddd',
            borderRadius: '8px'
          }}>
            <h4>{item.title}</h4>
            {item.description && <p>{item.description}</p>}
            <small>Criado em: {new Date(item.created_at).toLocaleDateString()}</small>
            
            <div style={{ marginTop: '10px' }}>
              <button onClick={() => handleEdit(item)} style={{ marginRight: '10px' }}>
                Editar
              </button>
              <button onClick={() => handleDelete(item.id)} style={{ color: 'red' }}>
                Excluir
              </button>
            </div>
          </li>
        ))}
      </ul>

      {items.length === 0 && <p>Nenhum item cadastrado ainda.</p>}
    </div>
  );
};

export default Dashboard;