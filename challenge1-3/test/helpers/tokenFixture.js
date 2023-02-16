const { ethers } = require("hardhat");
const {
    OWNER,TOTAL_SUPPLY
  } = require("./../config");

require('dotenv').config();
  const fixture = async () => {
        const [owner, user1,user2] = await ethers.getSigners();
        const Stakeable = await ethers.getContractFactory(
            "Stakeable"
        );
        const stakeable = await Stakeable.deploy(OWNER,TOTAL_SUPPLY);
        await stakeable.deployed();
  
        return {
            stakeable,
            owner,
            user1,
            user2,
        };
  }
  
  module.exports = fixture