// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  const electionName = "Lok Sabha Election 2024";
  const candidates = [
    "Narendra Modi",
    "Rahul Gandhi",
    "Arvind Kejriwal",
    "Mamata Banerjee",
    "Nitish Kumar",
  ];

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
