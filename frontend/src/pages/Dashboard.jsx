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
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:8888/.netlify/functions/read-items');
      setItems(response.data.items);
    } catch (err) {
      setError('Erro ao carregar itens');
      setTimeout(() => setError(''), 5000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        await axios.put('http://localhost:8888/.netlify/functions/update-item', {
          id: editingId,
          title,
          description
        });
        setSuccessMessage('Item atualizado com sucesso');
      } else {
        await axios.post('http://localhost:8888/.netlify/functions/create-item', {
          title,
          description
        });
        setSuccessMessage('Item criado com sucesso');
      }

      setTitle('');
      setDescription('');
      setEditingId(null);
      fetchItems();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao salvar item');
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setTitle(item.title);
    setDescription(item.description || '');
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja deletar este item?')) return;

    try {
      await axios.delete('http://localhost:8888/.netlify/functions/delete-item', {
        data: { id }
      });
      setSuccessMessage('Item deletado com sucesso');
      fetchItems();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Erro ao deletar item');
      setTimeout(() => setError(''), 5000);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
  };

  const styles = `
    .dashboard-container {
      min-height: 100vh;
      background-color: #f5f5f7;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif;
    }

    .dashboard-header {
      background-color: #ffffff;
      border-bottom: 1px solid #e5e5e7;
      position: sticky;
      top: 0;
      z-index: 100;
      backdrop-filter: blur(10px);
      background-color: rgba(255, 255, 255, 0.95);
    }

    .header-content {
      max-width: 900px;
      margin: 0 auto;
      padding: 2rem 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1.5rem;
    }

    .greeting {
      flex: 1;
    }

    .greeting h1 {
      font-size: 1.5625rem;
      font-weight: 700;
      margin-bottom: 0.25rem;
      letter-spacing: -0.5px;
      color: #1d1d1f;
    }

    .user-name {
      background: linear-gradient(135deg, #0071e3, #0077ed);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .subtitle {
      font-size: 0.9375rem;
      color: #86868b;
      font-weight: 400;
    }

    .logout-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1.5rem;
      background-color: #f5f5f7;
      color: #1d1d1f;
      border: 1px solid #e5e5e7;
      border-radius: 0.75rem;
      font-size: 0.9375rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
      white-space: nowrap;
    }

    .logout-btn:hover {
      background-color: #f0f0f2;
      border-color: #a1a1a6;
      transform: translateY(-1px);
    }

    .dashboard-content {
      max-width: 900px;
      margin: 0 auto;
      padding: 3rem 1.5rem;
    }

    .alert {
      padding: 1.5rem;
      border-radius: 1rem;
      margin-bottom: 2rem;
      font-size: 0.9375rem;
      font-weight: 500;
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

    .alert-success {
      background-color: rgba(52, 199, 89, 0.1);
      color: #30a14e;
      border: 1px solid rgba(52, 199, 89, 0.2);
    }

    .alert-error {
      background-color: rgba(255, 59, 48, 0.1);
      color: #d70015;
      border: 1px solid rgba(255, 59, 48, 0.2);
    }

    .form-section {
      background-color: #ffffff;
      border: 1px solid #e5e5e7;
      border-radius: 1.25rem;
      padding: 2.5rem;
      margin-bottom: 3rem;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    }

    .section-title {
      font-size: 1.125rem;
      font-weight: 600;
      margin-bottom: 2rem;
      color: #1d1d1f;
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .items-count {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 24px;
      height: 24px;
      background-color: #0071e3;
      color: white;
      border-radius: 50%;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .item-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
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
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .form-input,
    .form-textarea {
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

    .form-input::placeholder,
    .form-textarea::placeholder {
      color: #a1a1a6;
    }

    .form-input:focus,
    .form-textarea:focus {
      border-color: #0071e3;
      background-color: #ffffff;
      box-shadow: 0 0 0 3px rgba(0, 113, 227, 0.1);
    }

    .form-textarea {
      resize: vertical;
      min-height: 100px;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 1.5rem;
    }

    .btn {
      padding: 1rem 2rem;
      border: none;
      border-radius: 0.75rem;
      font-size: 0.9375rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      outline: none;
    }

    .btn-primary {
      background-color: #0071e3;
      color: white;
      flex: 1;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #0077ed;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      transform: translateY(-1px);
    }

    .btn-primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-secondary {
      background-color: #f5f5f7;
      color: #1d1d1f;
      border: 1px solid #e5e5e7;
    }

    .btn-secondary:hover {
      background-color: #f0f0f2;
    }

    .spinner {
      display: inline-block;
      width: 14px;
      height: 14px;
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

    .items-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .item-card {
      background-color: #ffffff;
      border: 1px solid #e5e5e7;
      border-radius: 1.25rem;
      padding: 2rem;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1.5rem;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
      transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
      animation: fadeInUp 250ms ease-out forwards;
      opacity: 0;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .item-card:hover {
      border-color: #f0f0f2;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }

    .item-content {
      flex: 1;
      min-width: 0;
    }

    .item-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1d1d1f;
      margin-bottom: 0.5rem;
    }

    .item-description {
      font-size: 1rem;
      color: #86868b;
      margin-bottom: 1rem;
      line-height: 1.6;
    }

    .item-meta {
      font-size: 0.8125rem;
      color: #a1a1a6;
      font-weight: 500;
    }

    .item-actions {
      display: flex;
      gap: 0.5rem;
      flex-shrink: 0;
    }

    .action-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.25rem;
      padding: 0.5rem 1rem;
      border: 1px solid #e5e5e7;
      background-color: #f5f5f7;
      border-radius: 0.75rem;
      font-size: 0.8125rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
      white-space: nowrap;
    }

    .action-edit {
      color: #0071e3;
      border-color: #0071e3;
    }

    .action-edit:hover {
      background-color: rgba(0, 113, 227, 0.1);
      transform: translateY(-1px);
    }

    .action-delete {
      color: #ff3b30;
      border-color: #ff3b30;
    }

    .action-delete:hover {
      background-color: rgba(255, 59, 48, 0.1);
      transform: translateY(-1px);
    }

    .empty-state {
      text-align: center;
      padding: 3rem 2.5rem;
      background-color: #ffffff;
      border: 1px solid #e5e5e7;
      border-radius: 1.25rem;
      margin-top: 1.5rem;
    }

    .empty-icon {
      font-size: 3rem;
      margin-bottom: 1.5rem;
      opacity: 0.7;
    }

    .empty-state p {
      font-size: 1rem;
      color: #1d1d1f;
      margin-bottom: 0.5rem;
      font-weight: 600;
    }

    .empty-subtitle {
      font-size: 0.9375rem;
      color: #86868b !important;
      font-weight: 400;
    }

    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        align-items: flex-start;
        padding: 1.5rem;
      }

      .dashboard-content {
        padding: 2rem 1rem;
      }

      .form-section {
        padding: 2rem;
      }

      .item-card {
        flex-direction: column;
        align-items: flex-start;
      }

      .item-actions {
        width: 100%;
        justify-content: flex-start;
      }

      .action-btn {
        flex: 1;
        justify-content: center;
      }

      .form-actions {
        flex-direction: column;
      }

      .btn {
        width: 100%;
      }
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="header-content">
            <div className="greeting">
              <h1>Bem-vindo, <span className="user-name">{user?.name}</span></h1>
              <p className="subtitle">Gerencie seus itens com facilidade</p>
            </div>
            <button className="logout-btn" onClick={logout}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5m0 0l-5-5m5 5H9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Sair
            </button>
          </div>
        </div>

        <div className="dashboard-content">
          {error && <div className="alert alert-error">{error}</div>}
          {successMessage && <div className="alert alert-success">{successMessage}</div>}

          <div className="form-section">
            <h2 className="section-title">{editingId ? 'Editar Item' : 'Criar Novo Item'}</h2>
            
            <form onSubmit={handleSubmit} className="item-form">
              <div className="form-group">
                <label htmlFor="title">Título</label>
                <input
                  id="title"
                  type="text"
                  placeholder="Dê um nome ao seu item..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Descrição</label>
                <textarea
                  id="description"
                  placeholder="Adicione detalhes (opcional)..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="form-textarea"
                />
              </div>

              <div className="form-actions">
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="btn btn-primary"
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      {editingId ? 'Atualizando...' : 'Criando...'}
                    </>
                  ) : (
                    editingId ? 'Atualizar Item' : 'Criar Item'
                  )}
                </button>

                {editingId && (
                  <button 
                    type="button" 
                    onClick={handleCancel}
                    className="btn btn-secondary"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="items-section">
            <h2 className="section-title">
              Meus Itens
              {items.length > 0 && <span className="items-count">{items.length}</span>}
            </h2>

            {items.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📝</div>
                <p>Nenhum item criado ainda</p>
                <p className="empty-subtitle">Comece criando seu primeiro item acima!</p>
              </div>
            ) : (
              <ul className="items-list">
                {items.map((item, index) => (
                  <li key={item.id} className="item-card" style={{ animationDelay: `${index * 0.05}s` }}>
                    <div className="item-content">
                      <h3 className="item-title">{item.title}</h3>
                      {item.description && (
                        <p className="item-description">{item.description}</p>
                      )}
                      <div className="item-meta">
                        <time dateTime={item.created_at}>
                          {new Date(item.created_at).toLocaleDateString('pt-BR', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </time>
                      </div>
                    </div>

                    <div className="item-actions">
                      <button 
                        onClick={() => handleEdit(item)}
                        className="action-btn action-edit"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Editar
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="action-btn action-delete"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <polyline points="3 6 5 6 21 6M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6m4-6v6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Deletar
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;