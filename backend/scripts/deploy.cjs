// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  const electionName = "Lok Sabha Election 2024";
  const candidates = [
    { name: "Rajesh Kumar", party: "Bharatiya Janata Party", logoUrl: "bjp-logo.png" },
    { name: "Priya Sharma", party: "Indian National Congress", logoUrl: "indian-national-congress-logo.png" },
    { name: "Amit Singh", party: "Aam Aadmi Party", logoUrl: "aap-party-logo.png" },
    { name: "Sunita Devi", party: "Independent", logoUrl: "independent-candidate-symbol.png" },
  ];

  const BharatVote = await hre.ethers.getContractFactory("BharatVote");
  const contract = await BharatVote.deploy(
    electionName,
    candidates.map((c) => c.name),
    candidates.map((c) => c.party),
    candidates.map((c) => c.logoUrl)
  );

  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("✅ BharatVote deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
