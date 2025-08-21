# BharatVote – Decentralized Voting on Blockchain

BharatVote is a blockchain-powered voting platform that allows anyone to cast their vote securely on the Polygon Amoy testnet.  
The goal of this project is to show how transparent, tamper-proof, and decentralized elections can look in the future.

##  Vision

- Traditional voting is often slow, costly, and vulnerable to manipulation.  
- BharatVote uses smart contracts to record votes permanently on the blockchain.  
- Every vote is transparent, verifiable, and cannot be altered once cast.  
- In the future, systems like this can redefine democracy by making elections:
  - Fast
  - Transparent 
  - Accessible from anywhere 
  - Trustless (no need to "trust" middlemen) 
    

##  How It Works

1. Smart Contract  
   - Deployed on the Polygon Amoy testnet.  
   - Holds the list of candidates.  
   - Each voter’s wallet address can only vote once.  
   - Votes are stored as immutable blockchain transactions.

2. Frontend (Next.js + Wagmi + Viem)  
   - User-friendly interface to connect a wallet, view candidates, and vote.  
   - Shows live vote counts, pulled directly from the smart contract.  

3. Wallet Integration  
   - We use MetaMask for wallet connection.  
   - Once connected, your account interacts directly with the blockchain contract.


##  How to Use (Step by Step)

### 1. Install MetaMask
- Download the [MetaMask extension](https://metamask.io/download/).  
- Create a wallet (save your seed phrase safely).  

### 2. Switch to Polygon Amoy Testnet
- Open MetaMask → Click network dropdown → Add **Polygon Amoy** manually, or  
- Use [Chainlist](https://chainlist.org/chain/80002) → "Connect Wallet" → Add Polygon Amoy.  

    Network details (if adding manually):
    Network Name: Polygon Amoy
    RPC URL: [https://rpc-amoy.polygon.technology/](https://rpc-amoy.polygon.technology/)
    Chain ID: 80002
    Currency Symbol: POL
    Block Explorer: [https://amoy.polygonscan.com/](https://amoy.polygonscan.com/)


### 3. Get Free Test POL (Faucet)
- Go to the [Polygon Faucet](https://faucet.polygon.technology/).  
- Connect your Wallet, select Amoy, and claim free POL test tokens.  
- You’ll receive a small balance of POL (used as gas for voting).

### 4. Connect Your Wallet
- Open the BharatVote site.  
- Click "Connect Wallet" → choose your wallet to approve connection.  

### 5. Cast Your Vote
- Browse the list of candidates.  
- Click Vote on your chosen candidate.  
- MetaMask will pop up → approve the transaction.  
- Wait for confirmation (a few seconds).

### 6. Verify Your Transaction
- After voting, you’ll see a transaction hash.  
- You can check it on PolygonScan:  
   [BharatVote Contract on Amoy Explorer](https://amoy.polygonscan.com/address/0x8Fd6bAB46201c808DDa0EaA019Aa5a009C972a7B)  
- Search for your wallet address or paste the tx hash to verify your vote.


##  Technical Details

- Smart Contract: Solidity, deployed to Polygon Amoy  
- Frontend: Next.js (React 19), TailwindCSS, Wagmi hooks  
- Wallet: MetaMask injected provider  
- Blockchain RPC: Polygon Amoy testnet RPC  
- Deployment: Vercel (frontend)  

Contract Address:  
0x8Fd6bAB46201c808DDa0EaA019Aa5a009C972a7B


## The Future of BharatVote

This is just the first step. In the future we aim to:  
- Enable large-scale elections with millions of voters.  
- Support zero-knowledge proofs for privacy (so your vote stays secret, but still verifiable).  
- Add multi-device support (mobile apps, kiosks).  
- Integrate government frameworks for real-world deployment.  

Blockchain voting can redefine democracy by ensuring every citizen’s vote is counted fairly and instantly.


## Contributing
This is an experimental project built during a hackathon. Contributions, feedback, and ideas are welcome!  


## Disclaimer
- BharatVote is deployed on the Polygon Amoy testnet for educational/demo purposes.  
- Votes here are not real elections, only a proof of concept.  
- Do not use this system for actual political voting without proper legal + security audits.


---
