import { readContract, writeContract } from '@wagmi/core';
import { config } from './config';

// Contract configuration
export const CONTRACT_ADDRESS = '0x9cA5179B5f5023e09E6646584A3b029CE284a455';
export const CONTRACT_ABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "_electionName", "type": "string" },
      { "internalType": "string[]", "name": "_candidateNames", "type": "string[]" }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "name": "candidates",
    "outputs": [
      { "internalType": "string", "name": "name", "type": "string" },
      { "internalType": "uint256", "name": "voteCount", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "electionName",
    "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllCandidates",
    "outputs": [
      {
        "components": [
          { "internalType": "string", "name": "name", "type": "string" },
          { "internalType": "uint256", "name": "voteCount", "type": "uint256" }
        ],
        "internalType": "struct BharatVote.Candidate[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_candidateIndex", "type": "uint256" }],
    "name": "vote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "name": "voters",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  }
];

// Type definitions
export interface Candidate {
  name: string;
  voteCount: number;
}

// Contract interaction functions
export async function getCandidates(): Promise<Candidate[]> {
  try {
    const candidates = await readContract(config, {
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'getAllCandidates',
    });
    
    return (candidates as any[]).map((candidate: any) => ({
      name: candidate.name,
      voteCount: Number(candidate.voteCount)
    }));
  } catch (error) {
    console.error('Error fetching candidates:', error);
    throw error;
  }
}

export async function voteForCandidate(candidateIndex: number, signer: any): Promise<string> {
  try {
    const hash = await writeContract(config, {
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'vote',
      args: [candidateIndex],
    });
    return hash;
  } catch (error) {
    console.error('Error voting:', error);
    throw error;
  }
}

export async function checkIfVoted(address: string, provider: any): Promise<boolean> {
  try {
    const hasVoted = await readContract(config, {
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'voters',
      args: [address],
    });
    return hasVoted as boolean;
  } catch (error) {
    console.error('Error checking vote status:', error);
    throw error;
  }
}

export async function getElectionName(): Promise<string> {
  try {
    const electionName = await readContract(config, {
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'electionName',
    });
    return electionName as string;
  } catch (error) {
    console.error('Error fetching election name:', error);
    throw error;
  }
}
