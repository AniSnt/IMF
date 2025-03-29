// backend/server.js  
require('dotenv').config();  
const express = require('express');  
const twilio = require('twilio');  
const { Web3 } = require('web3');  

const app = express();  
app.use(express.json());  

// Config Twilio  
const client = twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);  

// Config Polygon  
const web3 = new Web3('https://polygon-mumbai.infura.io/v3/SEU_INFURA_KEY');  
const contractABI = require('./smart-contracts/IMF.json').abi;  
const contractAddress = "0x..."; // Endereço do contrato deployado  

// Rota para mensagens WhatsApp  
app.post('/whatsapp', async (req, res) => {  
  const userMsg = req.body.Body;  
  const userNumber = req.body.From;  

  // Comando: "IMF: Descrição do caso"  
  if (userMsg.startsWith("IMF:")) {  
    const casoDesc = userMsg.split("IMF:")[1].trim();  

    // 1. Registrar na blockchain  
    const casoId = await registerOnBlockchain(casoDesc, userNumber);  

    // 2. Responder ao usuário  
    await client.messages.create({  
      body: `✅ Caso #${casoId} registrado! Juízes entrarão em contato.`,  
      from: process.env.TWILIO_PHONE,  
      to: userNumber  
    });  
  }  
});  

// Função para interagir com o contrato  
async function registerOnBlockchain(desc, author) {  
  const contract = new web3.eth.Contract(contractABI, contractAddress);  
  const accounts = await web3.eth.getAccounts();  

  const result = await contract.methods  
    .registrarCaso(desc, author)  
    .send({ from: accounts[0] });  

  return result.events.CasoRegistrado.returnValues.casoId;  
}  

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));  
