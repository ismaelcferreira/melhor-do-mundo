const API_URL = 'http://localhost:3001/api';

export async function getCandidatos() {
  const res = await fetch(`${API_URL}/candidatos`);
  if (!res.ok) throw new Error('Erro ao buscar candidatos');
  return res.json();
}

export async function getStats() {
  const res = await fetch(`${API_URL}/stats`);
  if (!res.ok) throw new Error('Erro ao buscar estatísticas');
  return res.json();
}

export async function votarCandidato(id) {
  const res = await fetch(`${API_URL}/candidatos/${id}/votar`, {
    method: 'PATCH',
  });
  if (!res.ok) throw new Error('Erro ao votar');
  return res.json();
}

export async function criarCandidato(data) {
  const res = await fetch(`${API_URL}/candidatos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Erro ao criar candidato');
  return res.json();
}

export async function deletarCandidato(id) {
  const res = await fetch(`${API_URL}/candidatos/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Erro ao deletar candidato');
  return res.json();
}

export async function zerarVotos() {
  const res = await fetch(`${API_URL}/candidatos/zerar-votos`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Erro ao zerar votos');
  return res.json();
}
