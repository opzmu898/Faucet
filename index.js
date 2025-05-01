const express = require('express');
const { ethers } = require('ethers');
require('dotenv').config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const FAUCET_AMOUNT = ethers.utils.parseEther("0.05");
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const RPC_URL = process.env.RPC_URL;

const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

app.post('/faucet', async (req, res) => {
  const { address } = req.body;
  if (!ethers.utils.isAddress(address)) {
    return res.status(400).json({ error: 'Invalid address' });
  }

  try {
    const tx = await wallet.sendTransaction({
      to: address,
      value: FAUCET_AMOUNT,
    });
    await tx.wait();
    res.json({ success: true, txHash: tx.hash });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Faucet error', message: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('MONAD Faucet is running.');
});

app.listen(PORT, () => {
  console.log(`Faucet listening on port ${PORT}`);
});