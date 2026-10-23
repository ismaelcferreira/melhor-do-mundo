import { useState, useEffect, useCallback } from 'react';
import { getCandidatos, getStats, votarCandidato, criarCandidato, deletarCandidato, zerarVotos } from './api';
import './App.css';

function App() {
  const [candidatos, setCandidatos] = useState([]);
  const [stats, setStats] = useState({ totalVotos: 0, lider: 'Nenhum', totalCandidatos: 0 });
  const [showModal, setShowModal] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [votingId, setVotingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nome: '', esporte: '', clube: '', pais: '', foto: ''
  });

  // =============================================
  // DATA FETCHING
  // =============================================
  const fetchData = useCallback(async () => {
    try {
      const [candidatosData, statsData] = await Promise.all([
        getCandidatos(),
        getStats()
      ]);
      setCandidatos(candidatosData);
      setStats(statsData);
    } catch (error) {
      addToast('Erro ao carregar dados. Verifique se o servidor está rodando.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // =============================================
  // TOAST SYSTEM
  // =============================================
  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  // =============================================
  // ACTIONS
  // =============================================
  const handleVotar = async (id) => {
    try {
      setVotingId(id);
      await votarCandidato(id);
      await fetchData();
      addToast('✨ Voto registrado com sucesso!');
      setTimeout(() => setVotingId(null), 500);
    } catch (error) {
      addToast('Erro ao registrar voto', 'error');
      setVotingId(null);
    }
  };

  const handleDeletar = async (id, nome) => {
    if (!window.confirm(`Tem certeza que deseja remover ${nome}?`)) return;
    try {
      await deletarCandidato(id);
      await fetchData();
      addToast(`${nome} foi removido`);
    } catch (error) {
      addToast('Erro ao remover candidato', 'error');
    }
  };

  const handleZerarVotos = async () => {
    if (!window.confirm('Tem certeza que deseja zerar todos os votos?')) return;
    try {
      await zerarVotos();
      await fetchData();
      addToast('Todos os votos foram zerados');
    } catch (error) {
      addToast('Erro ao zerar votos', 'error');
    }
  };

  const handleSubmitCandidato = async (e) => {
    e.preventDefault();
    if (!formData.nome || !formData.esporte || !formData.clube || !formData.pais) {
      addToast('Preencha todos os campos obrigatórios', 'error');
      return;
    }
    try {
      await criarCandidato(formData);
      await fetchData();
      setShowModal(false);
      setFormData({ nome: '', esporte: '', clube: '', pais: '', foto: '' });
      addToast(`${formData.nome} foi adicionado!`);
    } catch (error) {
      addToast('Erro ao adicionar candidato', 'error');
    }
  };

  // =============================================
  // HELPERS
  // =============================================
  const getPercentage = (votos) => {
    if (stats.totalVotos === 0) return 0;
    return ((votos / stats.totalVotos) * 100).toFixed(1);
  };

  const getRankClass = (index) => {
    if (index === 0) return 'rank-1';
    if (index === 1) return 'rank-2';
    if (index === 2) return 'rank-3';
    return '';
  };

  const getRankBadge = (index) => {
    const labels = ['🥇 1º Lugar', '🥈 2º Lugar', '🥉 3º Lugar'];
    return labels[index] || `#${index + 1}`;
  };

  const getRankBadgeClass = (index) => {
    if (index === 0) return 'rank-1-badge';
    if (index === 1) return 'rank-2-badge';
    if (index === 2) return 'rank-3-badge';
    return 'rank-default-badge';
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  // =============================================
  // RENDER
  // =============================================
  return (
    <>
      {/* Animated Background */}
      <div className="app-background" />

      {/* Toast Notifications */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <span>{toast.type === 'success' ? '✅' : '❌'}</span>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="app-container">
        {/* Hero Section */}
        <header className="hero-section">
          <div className="hero-badges">
            <span className="badge badge-live">Votação ao Vivo</span>
            <span className="badge badge-edition">⚡ Edição 2026</span>
          </div>
          <h1 className="hero-title">
            MELHOR DO <span className="highlight">MUNDO</span>
          </h1>
          <p className="hero-subtitle">
            Quem merece o topo supremo? Deixe o seu voto e acompanhe a apuração instantânea em tempo real.
          </p>
        </header>

        {/* Stats Bar */}
        <div className="stats-bar">
          <div className="stat-card">
            <div className="stat-icon stat-icon-votes">📊</div>
            <div>
              <div className="stat-label">Total de Votos</div>
              <div className="stat-value">{stats.totalVotos}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon stat-icon-leader">👑</div>
            <div>
              <div className="stat-label">Líder Atual</div>
              <div className="stat-value">{stats.lider}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon stat-icon-candidates">🏆</div>
            <div>
              <div className="stat-label">Candidatos</div>
              <div className="stat-value">{stats.totalCandidatos}</div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="action-bar">
          <div className="action-bar-left">
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              ➕ Adicionar Candidato
            </button>
          </div>
          <button className="btn btn-ghost" onClick={handleZerarVotos}>
            🔄 Zerar Votos
          </button>
        </div>

        {/* Section Header */}
        <div className="section-header">
          <h2 className="section-title">🏆 Quadro de Votação</h2>
          <span className="section-subtitle">⚡ Ordenado pelos mais votados</span>
        </div>

        {/* Voting Grid */}
        {loading ? (
          <div className="voting-grid">
            {[1, 2, 3].map(i => (
              <div key={i} className="skeleton" style={{ height: 250, borderRadius: 24 }} />
            ))}
          </div>
        ) : candidatos.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🏟️</div>
            <div className="empty-state-text">Nenhum candidato registrado</div>
            <div className="empty-state-subtext">Adicione o primeiro candidato para começar a votação!</div>
          </div>
        ) : (
          <div className="voting-grid">
            {candidatos.map((candidato, index) => (
              <div
                key={candidato.id}
                className={`candidate-card ${getRankClass(index)} ${votingId === candidato.id ? 'vote-animation' : ''}`}
              >
                {/* Card Header */}
                <div className="card-header">
                  <span className={`rank-badge ${getRankBadgeClass(index)}`}>
                    {getRankBadge(index)}
                  </span>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeletar(candidato.id, candidato.nome)}
                    title="Remover candidato"
                  >
                    🗑️
                  </button>
                </div>

                {/* Card Info */}
                <div className="card-info">
                  <div className="avatar">
                    {candidato.foto ? (
                      <img
                        src={candidato.foto}
                        alt={candidato.nome}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div
                      className="avatar-placeholder"
                      style={{ display: candidato.foto ? 'none' : 'flex' }}
                    >
                      {getInitials(candidato.nome)}
                    </div>
                  </div>
                  <div>
                    <div className="player-name">{candidato.nome}</div>
                    <div className="player-details">
                      {candidato.esporte} • {candidato.clube} / {candidato.pais}
                    </div>
                  </div>
                </div>

                {/* Vote Stats */}
                <div className="vote-stats">
                  <div className="vote-count">
                    <span className="vote-number">{candidato.votos}</span>
                    <span className="vote-label">votos</span>
                  </div>
                  <span className="vote-percentage">{getPercentage(candidato.votos)}%</span>
                </div>

                {/* Progress Bar */}
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${getPercentage(candidato.votos)}%` }}
                  />
                </div>

                {/* Vote Button */}
                <button
                  className="btn btn-vote"
                  onClick={() => handleVotar(candidato.id)}
                >
                  🗳️ Votar Neste
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal - Add Candidate */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => {
          if (e.target === e.currentTarget) setShowModal(false);
        }}>
          <div className="modal">
            <h3 className="modal-title">➕ Novo Candidato</h3>
            <form onSubmit={handleSubmitCandidato}>
              <div className="form-group">
                <label className="form-label">Nome *</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="Ex: Neymar Jr."
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Esporte *</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="Ex: Futebol"
                  value={formData.esporte}
                  onChange={(e) => setFormData({ ...formData, esporte: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Clube *</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="Ex: Santos FC"
                  value={formData.clube}
                  onChange={(e) => setFormData({ ...formData, clube: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">País *</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="Ex: Brasil"
                  value={formData.pais}
                  onChange={(e) => setFormData({ ...formData, pais: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">URL da Foto (opcional)</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="https://..."
                  value={formData.foto}
                  onChange={(e) => setFormData({ ...formData, foto: e.target.value })}
                />
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  ✅ Adicionar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
