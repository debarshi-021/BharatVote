// hardhat.config.js
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const { AMOY_RPC, PRIVATE_KEY } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: { enabled: true, runs: 200 },
    },
  },
  networks: {
    amoy: {
      url: AMOY_RPC || "https://rpc-amoy.polygon.technology/",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: 80002, // Amoy testnet chainId
    },
  },
};
