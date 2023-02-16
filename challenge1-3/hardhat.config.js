require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();
const {ALCHEMY_KEY, MNEMONIC, INFURA_KEY} = process.env;
  /** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    goerli: {
      url: 'https://goerli.infura.io/v3/' + INFURA_KEY,
      accounts: { mnemonic: MNEMONIC },
      chainId: 5,
    }
  },
  solidity: "0.8.17",
};
