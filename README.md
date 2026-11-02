# Rota das Origens Multiplayer

## Executar no computador
1. Instale Node.js 20 ou superior.
2. Na pasta do projeto, execute `npm install`.
3. Execute `npm start`.
4. Abra `http://localhost:3000`.

## Publicar no Render
1. Envie esta pasta para um repositório GitHub.
2. No Render, crie um Web Service conectado ao repositório.
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Compartilhe a URL criada pelo Render.

## Fluxo
- Administrador cria uma sala e compartilha o código.
- Participantes entram pelo mesmo endereço.
- Cada participante marca um ponto, visível apenas no próprio aparelho.
- O administrador vê quantos responderam e decide quando revelar.
- Na revelação, todos veem os palpites, a resposta e os pontos.

As salas ficam em memória. Se o servidor reiniciar, as salas abertas são encerradas. Para múltiplas instâncias, use Redis com o adapter do Socket.IO.
