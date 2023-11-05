// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const fs = require('fs');

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying SimpleAccountFactory...");
  const SimpleAccountFactory = await ethers.getContractFactory("SimpleAccountFactory");
  const simpleAccountFactory = await SimpleAccountFactory.deploy(deployer.address);

  await simpleAccountFactory.deployed();

  console.log("SimpleAccountFactory deployed to:", simpleAccountFactory.address);

  // export the addresses
  fs.writeFileSync('contractAddress.js', 
  `export const acctFactoryAddress = '${simpleAccountFactory.address}';`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
