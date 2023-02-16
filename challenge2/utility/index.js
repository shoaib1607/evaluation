
const {ethers, errors} = require('ethers')
const config = require("./config");
const express = require('express')
const app = express()
const port = 3000
require('dotenv').config();
const {OWNER, INFURA_KEY, SUPPLY, DECIMAL, MNEMONIC, ADDRESS1} = process.env;


async function contractInstance(){

// provider - Alchemy
//'https://goerli.infura.io/v3/' + INFURA_KEY
    const address = ADDRESS1;
    const amount = 10;
    const provider = new ethers.providers.JsonRpcProvider('HTTP://127.0.0.1:7545')
    const wallet = ethers.Wallet.fromMnemonic(MNEMONIC);
    const account = wallet.connect(provider);
    const myContract = new ethers.ContractFactory(config.ABI, config.BYTECODE, account); 
    const contract = await myContract.deploy(OWNER, SUPPLY, DECIMAL);
    return contract;
}

export default contractInstance;
    
