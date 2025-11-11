// Caminho sugerido: ../data/medicamentos.js

export const medicamentosMock = [
  {
    id: 101,
    nome: "Ibuprofeno",
    dosagem: "400mg",
    descricao: "Analgésico e Anti-inflamatório.",
    estoque: 50,
    chegadaPrevista: null, // null = Disponível
    disponibilidade: "Em Estoque", // Determinado pela quantidade em estoque
  },
  {
    id: 102,
    nome: "Amoxicilina",
    dosagem: "500mg",
    descricao: "Antibiótico de amplo espectro.",
    estoque: 15,
    chegadaPrevista: "2025-11-15",
    disponibilidade: "Baixo Estoque",
  },
  {
    id: 103,
    nome: "Dipirona",
    dosagem: "1g",
    descricao: "Analgésico e Antitérmico.",
    estoque: 0,
    chegadaPrevista: "2025-10-30",
    disponibilidade: "Indisponível",
  },
  {
    id: 104,
    nome: "Losartana",
    dosagem: "50mg",
    descricao: "Para controle de hipertensão.",
    estoque: 120,
    chegadaPrevista: null,
    disponibilidade: "Em Estoque",
  },
];