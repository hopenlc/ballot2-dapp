// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const Ballot = await hre.ethers.getContractFactory("Ballot");

  //Insert Proposal Names Here
  const ballot = await Ballot.deploy(["0x506f72706f73616c204100000000000000000000000000000000000000000000","0x506f72706f73616c204200000000000000000000000000000000000000000000","0x506f72706f73616c204300000000000000000000000000000000000000000000"]);

  await ballot.deployed();

  console.log("Ballot deployed to:", ballot.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
