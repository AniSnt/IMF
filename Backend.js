// backend/server.js
app.get('/votar/:casoId', async (req, res) => {  
  const casoId = req.params.casoId;  
  const userAddress = req.query.wallet; // Endereço da carteira do juiz  

  // Verifica se o endereço é juiz  
  const contract = new web3.eth.Contract(contractABI, contractAddress);  
  const isJuiz = await contract.methods.juizes(userAddress).call();  

  if (!isJuiz) {  
    return res.status(403).send("Acesso negado: voce nao e um juiz");  
  }  

  // Retorna página de votação (HTML simples)  
  res.send(`  
    <html>  
      <body>  
        <h1>Votar no Caso #${casoId}</h1>  
        <button onclick="votar(true)">Aceitar</button>  
        <button onclick="votar(false)">Rejeitar</button>  
        <script>  
          async function votar(decisao) {  
            await ethereum.request({ method: 'eth_requestAccounts' });  
            const accounts = await ethereum.request({ method: 'eth_accounts' });  
            const tx = await fetch('/api/votar', {  
              method: 'POST',  
              body: JSON.stringify({ casoId: ${casoId}, decisao, wallet: accounts[0] })  
            });  
            alert("Voto registrado!");  
          }  
        </script>  
      </body>  
    </html>  
  `);  
});  

// Rota para registrar voto na blockchain  
app.post('/api/votar', async (req, res) => {  
  const { casoId, decisao, wallet } = req.body;  
  const contract = new web3.eth.Contract(contractABI, contractAddress);  

  await contract.methods  
    .votar(casoId, decisao)  
    .send({ from: wallet });  

  res.json({ success: true });  
});  

