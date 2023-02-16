
require('dotenv').config();
const {OWNER, SUPPLY, DECIMAL} = process.env;


async function main() {
  const Stakeable = await ethers.getContractFactory("Stakeable");
  const stakeable = await Stakeable.deploy(OWNER,SUPPLY,DECIMAL);
  await stakeable.deployed();
  console.log('Stakeable contract deployed at address:', stakeable.address);
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});