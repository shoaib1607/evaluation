const {contract} = require('../utility/index')

async function getBalance(contract){
    const balance = await contract.balanceOf(OWNER);
    //console.log(balance);
    return balance 
}

getBalance();