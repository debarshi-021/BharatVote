// app/contracts/bharatVote.ts
import abiJson from './BharatVote.abi.json';
import addresses from './addresses.amoy.json';

export const BHARATVOTE_ADDRESS = (addresses as any).BharatVote as `0x${string}`;
export const BHARATVOTE_ABI = (abiJson as any).abi;
export const MAX_CANDIDATES = 12; // safety upper bound for scanning
