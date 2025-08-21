// hooks/useBharatVote.ts
'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { readContract, writeContract, getAccount, connect, disconnect, switchChain } from 'wagmi/actions';
import { injected } from 'wagmi/connectors';
import { wagmiConfig } from '../lib/wagmi';
import { polygonAmoy } from 'wagmi/chains';
import { BHARATVOTE_ADDRESS, BHARATVOTE_ABI, MAX_CANDIDATES } from '../app/contracts/bharatVote';

export type UICandidate = {
  id: number;
  name: string;
  party: string;
  partyLogo: string;
  votes: number;
  manifesto: string;
};

async function ensureAmoy() {
  try {
    await switchChain(wagmiConfig, { chainId: polygonAmoy.id });
  } catch { /* ignore if already on Amoy */ }
}

async function readOne(index: number): Promise<UICandidate | null> {
  // Try a consolidated getter first: getCandidate(uint256) -> (name, party, logoUrl, votes, manifesto)
  try {
    const tup = await readContract(wagmiConfig, {
      address: BHARATVOTE_ADDRESS,
      abi: BHARATVOTE_ABI,
      functionName: 'getCandidate',
      args: [BigInt(index)],
    }) as any[];

    if (Array.isArray(tup) && tup.length >= 4) {
      const [name, party, logo, votes, manifesto] = tup;
      return {
        id: index,
        name: String(name),
        party: String(party ?? ''),
        partyLogo: String(logo ?? ''),
        votes: Number(votes ?? 0),
        manifesto: String(manifesto ?? ''),
      };
    }
  } catch {}

  // Try public array: candidates(uint256) -> (name, votes) plus parallel arrays for meta
  try {
    const cand = await readContract(wagmiConfig, {
      address: BHARATVOTE_ADDRESS,
      abi: BHARATVOTE_ABI,
      functionName: 'candidates',
      args: [BigInt(index)],
    }) as any[];

    if (Array.isArray(cand) && cand.length >= 2) {
      const [name, votes] = cand;

      // optional parallel getters
      let party = '', logo = '', manifesto = '';
      try {
        party = String(await readContract(wagmiConfig, {
          address: BHARATVOTE_ADDRESS, abi: BHARATVOTE_ABI,
          functionName: 'parties', args: [BigInt(index)],
        }) as any);
      } catch {}
      try {
        logo = String(await readContract(wagmiConfig, {
          address: BHARATVOTE_ADDRESS, abi: BHARATVOTE_ABI,
          functionName: 'logoUrls', args: [BigInt(index)],
        }) as any);
      } catch {}
      try {
        manifesto = String(await readContract(wagmiConfig, {
          address: BHARATVOTE_ADDRESS, abi: BHARATVOTE_ABI,
          functionName: 'manifestos', args: [BigInt(index)],
        }) as any);
      } catch {}

      return {
        id: index,
        name: String(name),
        party,
        partyLogo: logo,
        votes: Number(votes ?? 0),
        manifesto,
      };
    }
  } catch {}

  // Try fully split storage: candidateNames / parties / logoUrls / votes
  try {
    const [name, party, logo, votes, manifesto] = await Promise.all([
      readContract(wagmiConfig, { address: BHARATVOTE_ADDRESS, abi: BHARATVOTE_ABI, functionName: 'candidateNames', args: [BigInt(index)] }) as Promise<any>,
      readContract(wagmiConfig, { address: BHARATVOTE_ADDRESS, abi: BHARATVOTE_ABI, functionName: 'parties',        args: [BigInt(index)] }) as Promise<any>,
      readContract(wagmiConfig, { address: BHARATVOTE_ADDRESS, abi: BHARATVOTE_ABI, functionName: 'logoUrls',      args: [BigInt(index)] }) as Promise<any>,
      readContract(wagmiConfig, { address: BHARATVOTE_ADDRESS, abi: BHARATVOTE_ABI, functionName: 'votes',         args: [BigInt(index)] }) as Promise<any>,
      (async () => {
        try {
          return await readContract(wagmiConfig, { address: BHARATVOTE_ADDRESS, abi: BHARATVOTE_ABI, functionName: 'manifestos', args: [BigInt(index)] }) as any;
        } catch { return ''; }
      })(),
    ]);

    return {
      id: index,
      name: String(name ?? ''),
      party: String(party ?? ''),
      partyLogo: String(logo ?? ''),
      votes: Number(votes ?? 0),
      manifesto: String(manifesto ?? ''),
    };
  } catch {}

  return null;
}

export function useBharatVote() {
  const [candidates, setCandidates] = useState<UICandidate[]>([]);
  const account = useMemo(() => getAccount(wagmiConfig), []);
  const [connecting, setConnecting] = useState(false);
  const [pendingTx, setPendingTx] = useState<string | null>(null);

  const isConnected = !!account?.address;
  const walletAddress = account?.address ?? '';

  const connectWallet = useCallback(async () => {
    setConnecting(true);
    try {
      await connect(wagmiConfig, { connector: injected() });
      await ensureAmoy();
    } finally {
      setConnecting(false);
    }
  }, []);

  const load = useCallback(async () => {
    const list: UICandidate[] = [];
    for (let i = 0; i < MAX_CANDIDATES; i++) {
      const cand = await readOne(i);
      if (!cand) {
        // stop at first gap to avoid unnecessary calls
        if (i === 0) throw new Error('No candidates found on-chain. Check ABI/address.');
        break;
      }
      list.push(cand);
    }
    setCandidates(list);
  }, []);

  const vote = useCallback(async (candidateId: number) => {
    await ensureAmoy();
    const txHash = await writeContract(wagmiConfig, {
      address: BHARATVOTE_ADDRESS,
      abi: BHARATVOTE_ABI,
      functionName: 'vote',
      args: [BigInt(candidateId)],
    }) as string;
    setPendingTx(txHash);
    // light polling after tx to reflect new total
    setTimeout(load, 3500);
    return txHash;
  }, [load]);

  useEffect(() => {
    load().catch(console.error);
    const t = setInterval(load, 5000); // keep UI fresh even without events
    return () => clearInterval(t);
  }, [load]);

  return {
    candidates,
    isConnected,
    walletAddress,
    connectWallet,
    connecting,
    vote,
    pendingTx,
  };
}
