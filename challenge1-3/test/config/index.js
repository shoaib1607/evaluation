require('dotenv').config();
const {OWNER} = process.env;
module.exports = {
    NAME:'MYToken',
    SYMBOL: 'MT',
    TOTAL_SUPPLY : 1000,
    OWNER,
    DECIMALS:18,
    ZERO_ADDRESS:'0x0000000000000000000000000000000000000000',
}