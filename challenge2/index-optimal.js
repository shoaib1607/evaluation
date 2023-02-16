
///This is more optimal way but need more time 
const {ethers, errors} = require('ethers')
const config = require("./config");
const express = require('express')
const app = express()
const port = 3000
require('dotenv').config();
const {OWNER, INFURA_KEY, SUPPLY, DECIMAL, MNEMONIC, ADDRESS1} = process.env;
const {getBalance} = require('./scripts/getBalance')
const {Transfer} = require('./scripts/transfer');
async function main(){

// provider - Alchemy
//'https://goerli.infura.io/v3/' + INFURA_KEY
    const address = ADDRESS1;
    const amount = 10;
    const provider = new ethers.providers.JsonRpcProvider('HTTP://127.0.0.1:7545')
    const wallet = ethers.Wallet.fromMnemonic(MNEMONIC);
    const account = wallet.connect(provider);
    const myContract = new ethers.ContractFactory(config.ABI, config.BYTECODE, account); 
    const contract = await myContract.deploy(OWNER, SUPPLY, DECIMAL);
}
    app.get('/getBalance', (req, res) => {
        const balance = getBalance(contract)
        res.send(balance);
    })

    app.get('/Transfer', (req, res) => {
        const result = Transfer(contract, req.body.address, req.body.amount)
    })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

