const express=require('express');const http=require('http');const {Server}=require('socket.io');const path=require('path');
const app=express(),server=http.createServer(app),io=new Server(server);app.use(express.static(path.join(__dirname,'public')));
const rooms=new Map();
const places=[
{name:'Vale dos Vinhedos',product:'Vinhos e espumantes',clue:'Região de imigração italiana próxima a Bento Gonçalves.',x:244,y:552,state:'Rio Grande do Sul',fact:'Primeira indicação geográfica brasileira reconhecida pelo INPI.'},
{name:'Região de Salinas',product:'Cachaça',clue:'Território do norte de Minas Gerais reconhecido pela bebida de cana.',x:389,y:340,state:'Minas Gerais',fact:'A reputação regional está ligada à produção tradicional de cachaça.'},
{name:'Goiabeiras',product:'Panelas de barro',clue:'Bairro de uma capital do Sudeste conhecido pelo ofício das paneleiras.',x:464,y:374,state:'Espírito Santo',fact:'Origem territorial e saber-fazer artesanal caminham juntos.'},
{name:'Jalapão',product:'Artesanato em capim dourado',clue:'Cerrado, dunas e fervedouros no Tocantins.',x:347,y:236,state:'Tocantins',fact:'A indicação valoriza matéria-prima local e técnica tradicional.'},
{name:'Franca',product:'Calçados',clue:'Cidade do interior paulista conhecida pela indústria de calçados.',x:375,y:413,state:'São Paulo',fact:'A indicação de procedência também alcança produtos manufaturados.'},
{name:'Norte Pioneiro do Paraná',product:'Café',clue:'Região cafeeira paranaense próxima à divisa com São Paulo.',x:340,y:462,state:'Paraná',fact:'A área reúne dezenas de municípios e valoriza rastreabilidade.'},
{name:'Alta Mogiana',product:'Café',clue:'Região de altitude no nordeste paulista, próxima a Minas Gerais.',x:390,y:399,state:'São Paulo',fact:'A notoriedade territorial é o núcleo da indicação de procedência.'},
{name:'Serra da Canastra',product:'Queijo',clue:'Região montanhosa do sudoeste mineiro.',x:382,y:373,state:'Minas Gerais',fact:'O nome territorial é reservado aos produtores habilitados.'},
{name:'Paraty',product:'Cachaça',clue:'Cidade histórica litorânea entre Rio de Janeiro e São Paulo.',x:426,y:434,state:'Rio de Janeiro',fact:'A reputação histórica local está associada à produção de cachaça.'},
{name:'Cariri Paraibano',product:'Renda renascença',clue:'Região semiárida no interior da Paraíba.',x:493,y:198,state:'Paraíba',fact:'O artesanato pode ser valorizado pela proteção da origem.'},
{name:'Divina Pastora',product:'Renda de agulha em lacê',clue:'Município de Sergipe conhecido pela renda irlandesa.',x:506,y:253,state:'Sergipe',fact:'A indicação valoriza conhecimento tradicional e identidade local.'},
{name:'Linhares',product:'Cacau em amêndoas',clue:'Município do norte do Espírito Santo, próximo ao litoral.',x:469,y:351,state:'Espírito Santo',fact:'A origem territorial diferencia o cacau produzido na região.'}
];
function code(){let c;do c=Math.random().toString(36).slice(2,7).toUpperCase();while(rooms.has(c));return c}
function publicState(r){const q=r.order[r.round];return{code:r.code,phase:r.phase,round:r.round,total:r.order.length,question:q?{name:q.name,product:q.product,clue:q.clue}:null,players:[...r.players.values()].map(p=>({id:p.id,name:p.name,score:p.score,submitted:!!r.guesses.get(p.id)})),submitted:r.guesses.size}}
function emit(r){io.to(r.code).emit('state',publicState(r))}
io.on('connection',socket=>{
 socket.on('createRoom',({hostName}={},ack=()=>{})=>{const c=code();const r={code:c,hostId:socket.id,hostName:(hostName||'Administrador').slice(0,30),phase:'lobby',round:0,order:[...places].sort(()=>Math.random()-.5),players:new Map(),guesses:new Map()};rooms.set(c,r);socket.join(c);socket.data={code:c,role:'host'};ack({ok:true,code:c});emit(r)});
 socket.on('joinRoom',({code:c,name}={},ack=()=>{})=>{c=(c||'').toUpperCase();const r=rooms.get(c);if(!r)return ack({ok:false,error:'Sala não encontrada'});if(r.phase!=='lobby')return ack({ok:false,error:'A partida já começou'});const clean=(name||'Participante').trim().slice(0,24);r.players.set(socket.id,{id:socket.id,name:clean,score:0});socket.join(c);socket.data={code:c,role:'player'};ack({ok:true,code:c});emit(r)});
 socket.on('start',()=>{const r=rooms.get(socket.data?.code);if(!r||r.hostId!==socket.id)return;r.phase='guessing';r.round=0;r.guesses.clear();emit(r)});
 socket.on('guess',({x,y}={})=>{const r=rooms.get(socket.data?.code);if(!r||r.phase!=='guessing'||!r.players.has(socket.id)||r.guesses.has(socket.id))return;if(!Number.isFinite(x)||!Number.isFinite(y))return;r.guesses.set(socket.id,{x,y});emit(r)});
 socket.on('reveal',()=>{const r=rooms.get(socket.data?.code);if(!r||r.hostId!==socket.id||r.phase!=='guessing')return;const q=r.order[r.round];for(const [id,g] of r.guesses){const d=Math.hypot(g.x-q.x,g.y-q.y),pts=Math.max(100,Math.round(1000-d*5.2));const pl=r.players.get(id);if(pl)pl.score+=pts,g.points=pts}r.phase='revealed';io.to(r.code).emit('reveal',{answer:q,guesses:[...r.guesses.entries()].map(([id,g])=>({id,name:r.players.get(id)?.name||'Participante',...g}))});emit(r)});
 socket.on('next',()=>{const r=rooms.get(socket.data?.code);if(!r||r.hostId!==socket.id||r.phase!=='revealed')return;r.round++;r.guesses.clear();if(r.round>=r.order.length)r.phase='finished';else r.phase='guessing';emit(r)});
 socket.on('disconnect',()=>{const r=rooms.get(socket.data?.code);if(!r)return;if(r.hostId===socket.id){io.to(r.code).emit('closed');rooms.delete(r.code)}else{r.players.delete(socket.id);r.guesses.delete(socket.id);emit(r)}})
});
server.listen(process.env.PORT||3000,()=>console.log('Rota das Origens em http://localhost:'+(process.env.PORT||3000)));
