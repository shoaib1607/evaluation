# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
```

The deploy contract address : 0x414b422a84116174a65c4dFFc7Bbf9b6AcDd8C17
You can check on etherscan : https://goerli.etherscan.io/address/0x414b422a84116174a65c4dFFc7Bbf9b6AcDd8C17

For testing reward and unstaking we need to stake more than 5 min so not writing test cases
but it was tested on remix, you can test if you want.
we can test on goerli but have some issue while performing transaction.