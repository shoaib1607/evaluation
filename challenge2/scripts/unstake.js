
const {contract} = require('../utility')
const {OWNER} = process.env

async function _unstake(){
    contract.stake(OWNER)
    setTimeout(360000);
    contract.unstake();
    const reward = contract.rewardOf(OWNER)
    console.log(reward)
}

_unstake();