// scripts/deploy.js
import { ethers } from "hardhat";
import fs from "fs";

async function main() {
  const electionName = "Student Council Election";
  const candidates = ["Alice", "Bob", "Charlie"];

  const BharatVote = await ethers.getContractFactory("BharatVote");
  const contract = await BharatVote.deploy(electionName, candidates);
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("BharatVote deployed to:", address);

  if (!fs.existsSync("exports")) fs.mkdirSync("exports");
  fs.writeFileSync(
    "exports/addresses.amoy.json",
    JSON.stringify({ BharatVote: address }, null, 2)
  );
  console.log("Saved address to exports/addresses.amoy.json");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
