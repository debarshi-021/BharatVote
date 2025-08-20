// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  const electionName = "Student Council Election";
  const candidates = ["Alice", "Bob", "Charlie"];

  const BharatVote = await hre.ethers.getContractFactory("BharatVote");
  const contract = await BharatVote.deploy(electionName, candidates);

  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("✅ BharatVote deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
