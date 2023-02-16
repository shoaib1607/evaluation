const {contract} = require('../utility')
const {OWNER} = process.env
async function stake(contract){
    contract.stake();
    const index = contract.stakes(ADDRESS1);
    console.log(index);
}

stake()