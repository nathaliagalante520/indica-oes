const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, "public")));

const rooms = new Map();

const places = [
  {
    name: "Vale dos Vinhedos",
    product: "Vinhos e espumantes",
    clue: "Região de imigração italiana próxima a Bento Gonçalves.",
    x: 244,
    y: 552,
    state: "Rio Grande do Sul",
    fact: "Foi a primeira indicação geográfica brasileira reconhecida pelo INPI."
  },
  {
    name: "Região de Salinas",
    product: "Cachaça",
    clue: "Território do norte de Minas Gerais reconhecido pela bebida de cana.",
    x: 389,
    y: 340,
    state: "Minas Gerais",
    fact: "A reputação regional está ligada à produção tradicional de cachaça."
  },
  {
    name: "Goiabeiras",
    product: "Panelas de barro",
    clue: "Bairro de uma capital do Sudeste conhecido pelo ofício das paneleiras.",
    x: 464,
    y: 374,
    state: "Espírito Santo",
    fact: "Origem territorial e saber-fazer artesanal caminham juntos."
  },
  {
    name: "Jalapão",
    product: "Artesanato em capim dourado",
    clue: "Cerrado, dunas e fervedouros no Tocantins.",
    x: 347,
    y: 236,
    state: "Tocantins",
    fact: "A indicação valoriza matéria-prima local e técnica tradicional."
  },
  {
    name: "Franca",
    product: "Calçados",
    clue: "Cidade do interior paulista conhecida pela indústria de calçados.",
    x: 375,
    y: 413,
    state: "São Paulo",
    fact: "A indicação de procedência também alcança produtos manufaturados."
  },
  {
    name: "Norte Pioneiro do Paraná",
    product: "Café",
    clue: "Região cafeeira paranaense próxima à divisa com São Paulo.",
    x: 340,
    y: 462,
    state: "Paraná",
    fact: "A área reúne dezenas de municípios e valoriza a rastreabilidade."
  },
  {
    name: "Alta Mogiana",
    product: "Café",
    clue: "Região de altitude no nordeste paulista, próxima a Minas Gerais.",
    x: 390,
    y: 399,
    state: "São Paulo",
    fact: "A notoriedade territorial é o núcleo da indicação de procedência."
  },
  {
    name: "Serra da Canastra",
    product: "Queijo",
    clue: "Região montanhosa do sudoeste mineiro.",
    x: 382,
    y: 373,
    state: "Minas Gerais",
    fact: "O nome territorial é reservado aos produtores habilitados."
  },
  {
    name: "Paraty",
    product: "Cachaça",
    clue: "Cidade histórica litorânea entre Rio de Janeiro e São Paulo.",
    x: 426,
    y: 434,
    state: "Rio de Janeiro",
    fact: "A reputação histórica local está associada à produção de cachaça."
  },
  {
    name: "Cariri Paraibano",
    product: "Renda renascença",
    clue: "Região semiárida no interior da Paraíba.",
    x: 493,
    y: 198,
    state: "Paraíba",
    fact: "O artesanato pode ser valorizado pela proteção da origem."
  },
  {
    name: "Divina Pastora",
    product: "Renda de agulha em lacê",
    clue: "Município de Sergipe conhecido pela renda irlandesa.",
    x: 506,
    y: 253,
    state: "Sergipe",
    fact: "A indicação valoriza conhecimento tradicional e identidade local."
  },
  {
    name: "Linhares",
    product: "Cacau
