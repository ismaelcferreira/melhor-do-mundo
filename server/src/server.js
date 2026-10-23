const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// ==========================================
// ROTAS DA API - CANDIDATOS
// ==========================================

// GET /api/candidatos - Listar todos os candidatos (ordenados por votos)
app.get('/api/candidatos', async (req, res) => {
  try {
    const candidatos = await prisma.candidato.findMany({
      orderBy: { votos: 'desc' },
    });
    res.json(candidatos);
  } catch (error) {
    console.error('Erro ao buscar candidatos:', error);
    res.status(500).json({ error: 'Erro ao buscar candidatos' });
  }
});

// GET /api/candidatos/:id - Buscar candidato por ID
app.get('/api/candidatos/:id', async (req, res) => {
  try {
    const candidato = await prisma.candidato.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!candidato) {
      return res.status(404).json({ error: 'Candidato não encontrado' });
    }
    res.json(candidato);
  } catch (error) {
    console.error('Erro ao buscar candidato:', error);
    res.status(500).json({ error: 'Erro ao buscar candidato' });
  }
});

// POST /api/candidatos - Criar novo candidato
app.post('/api/candidatos', async (req, res) => {
  try {
    const { nome, esporte, clube, pais, foto } = req.body;

    if (!nome || !esporte || !clube || !pais) {
      return res.status(400).json({ error: 'Campos obrigatórios: nome, esporte, clube, pais' });
    }

    const candidato = await prisma.candidato.create({
      data: { nome, esporte, clube, pais, foto: foto || null },
    });
    res.status(201).json(candidato);
  } catch (error) {
    console.error('Erro ao criar candidato:', error);
    res.status(500).json({ error: 'Erro ao criar candidato' });
  }
});

// PATCH /api/candidatos/:id/votar - Votar em um candidato
app.patch('/api/candidatos/:id/votar', async (req, res) => {
  try {
    const candidato = await prisma.candidato.update({
      where: { id: parseInt(req.params.id) },
      data: { votos: { increment: 1 } },
    });
    res.json(candidato);
  } catch (error) {
    console.error('Erro ao votar:', error);
    res.status(500).json({ error: 'Erro ao registrar voto' });
  }
});

// DELETE /api/candidatos/:id - Deletar candidato
app.delete('/api/candidatos/:id', async (req, res) => {
  try {
    await prisma.candidato.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ message: 'Candidato removido com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar candidato:', error);
    res.status(500).json({ error: 'Erro ao deletar candidato' });
  }
});

// POST /api/candidatos/zerar-votos - Zerar todos os votos
app.post('/api/candidatos/zerar-votos', async (req, res) => {
  try {
    await prisma.candidato.updateMany({
      data: { votos: 0 },
    });
    res.json({ message: 'Todos os votos foram zerados' });
  } catch (error) {
    console.error('Erro ao zerar votos:', error);
    res.status(500).json({ error: 'Erro ao zerar votos' });
  }
});

// GET /api/stats - Estatísticas gerais
app.get('/api/stats', async (req, res) => {
  try {
    const candidatos = await prisma.candidato.findMany({
      orderBy: { votos: 'desc' },
    });

    const totalVotos = candidatos.reduce((acc, c) => acc + c.votos, 0);
    const lider = candidatos.length > 0 ? candidatos[0] : null;
    const totalCandidatos = candidatos.length;

    res.json({
      totalVotos,
      lider: lider ? lider.nome : 'Nenhum',
      totalCandidatos,
    });
  } catch (error) {
    console.error('Erro ao buscar stats:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
});

// ==========================================
// INICIAR SERVIDOR
// ==========================================
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📊 API disponível em http://localhost:${PORT}/api`);
});
