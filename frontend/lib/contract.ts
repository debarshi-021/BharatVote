// Address of your Amoy deployment
export const BHARATVOTE_ADDRESS =
  "0x8Fd6bAB46201c808DDa0EaA019Aa5a009C972a7B" as const;

// Minimal ABI that works for both shapes:
//  - getCandidates() -> (string[] names, string[] parties, string[] logos, uint256[] votes)
//  - or candidates(i) -> (name, party, logoUrl, votes) [+ getCandidateCount()]
export const BHARATVOTE_ABI = [
  // write
  {
    type: "function",
    name: "vote",
    stateMutability: "nonpayable",
    inputs: [{ name: "index", type: "uint256" }],
    outputs: [],
  },

  // read shape A (arrays)
  {
    type: "function",
    name: "getCandidates",
    stateMutability: "view",
    inputs: [],
    outputs: [
      { name: "names", type: "string[]" },
      { name: "parties", type: "string[]" },
      { name: "logos", type: "string[]" },
      { name: "votes", type: "uint256[]" },
    ],
  },

  // read shape B (struct by index)
  {
    type: "function",
    name: "candidates",
    stateMutability: "view",
    inputs: [{ name: "", type: "uint256" }],
    outputs: [
      { name: "name", type: "string" },
      { name: "party", type: "string" },
      { name: "logoUrl", type: "string" },
      { name: "votes", type: "uint256" },
    ],
  },
  {
    type: "function",
    name: "getCandidateCount",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },

  // optional event (auto-refresh if present)
  {
    type: "event",
    name: "Voted",
    inputs: [
      { indexed: true, name: "voter", type: "address" },
      { indexed: false, name: "index", type: "uint256" },
    ],
    anonymous: false,
  },
] as const;
