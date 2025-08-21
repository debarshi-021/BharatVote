// scripts/export.cjs
const fs = require("fs");
const path = require("path");

// 1) Address -> exports/addresses.amoy.json
const address = "0x8Fd6bAB46201c808DDa0EaA019Aa5a009C972a7B";
fs.mkdirSync("exports", { recursive: true });
fs.writeFileSync(
  "exports/addresses.amoy.json",
  JSON.stringify({ BharatVote: address }, null, 2)
);

// 2) ABI -> exports/BharatVote.abi.json
const artifactPath = path.join(
  "artifacts",
  "contracts",
  "BharatVote.sol",
  "BharatVote.json"
);
const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
fs.writeFileSync(
  "exports/BharatVote.abi.json",
  JSON.stringify({ abi: artifact.abi }, null, 2)
);

console.log("✅ Wrote exports/addresses.amoy.json and exports/BharatVote.abi.json");
