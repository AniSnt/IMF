// Adicione no server.js  
const { create } = require('ipfs-http-client');  

const ipfs = create({ url: 'https://ipfs.infura.io:5001' });  

app.post('/upload', async (req, res) => {  
  const fileBuffer = req.file.buffer;  
  const { cid } = await ipfs.add(fileBuffer);  
  res.send(`https://ipfs.io/ipfs/${cid}`);  
});  

