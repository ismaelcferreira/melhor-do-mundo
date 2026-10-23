const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Limpar dados existentes
  await prisma.candidato.deleteMany();

  // Seed com candidatos iniciais
  const candidatos = [
    {
      nome: 'Lionel Messi',
      esporte: 'Futebol',
      clube: 'Inter Miami',
      pais: 'Argentina',
      foto: 'https://img.a.transfermarkt.technology/portrait/header/28003-1710080339.jpg',
      votos: 0,
    },
    {
      nome: 'Vinícius Jr.',
      esporte: 'Futebol',
      clube: 'Real Madrid',
      pais: 'Brasil',
      foto: 'https://img.a.transfermarkt.technology/portrait/header/371998-1696795337.jpg',
      votos: 0,
    },
    {
      nome: 'Cristiano Ronaldo',
      esporte: 'Futebol',
      clube: 'Al-Nassr',
      pais: 'Portugal',
      foto: 'https://img.a.transfermarkt.technology/portrait/header/8198-1694609670.jpg',
      votos: 0,
    },
    {
      nome: 'Erling Haaland',
      esporte: 'Futebol',
      clube: 'Man. City',
      pais: 'Noruega',
      foto: 'https://img.a.transfermarkt.technology/portrait/header/418560-1696게1517.jpg',
      votos: 0,
    },
  ];

  for (const candidato of candidatos) {
    await prisma.candidato.create({ data: candidato });
  }

  console.log('✅ Seed executado com sucesso! Candidatos criados.');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
