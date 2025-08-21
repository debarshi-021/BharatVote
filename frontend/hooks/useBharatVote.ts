// frontend/hooks/useBharatVote.ts
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  useAccount,
  usePublicClient,
  useWriteContract,
  useWatchContractEvent,
} from "wagmi";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { polygonAmoy } from "viem/chains";
import { BHARATVOTE_ABI, BHARATVOTE_ADDRESS } from "../lib/contract";

const toNum = (v: any) =>
  typeof v === "bigint" ? Number(v) : Number.isFinite(Number(v)) ? Number(v) : 0;

export function useBharatVote() {
  const { address, isConnected, chainId } = useAccount();
  const publicClient = usePublicClient({ chainId: 80002 }) ?? usePublicClient();
  const queryClient = useQueryClient();

  const [pendingTx, setPendingTx] = useState<string | null>(null);

  // ---------- READ: candidates (works for both ABI shapes) ----------
  const { data: candidates = [], refetch } = useQuery({
    queryKey: ["bharatvote", "candidates", BHARATVOTE_ADDRESS, chainId ?? 80002],
    queryFn: async () => {
      if (!publicClient) return [];

      // Try shape A: getCandidates() -> arrays
      try {
        const res: any = await publicClient.readContract({
          abi: BHARATVOTE_ABI,
          address: BHARATVOTE_ADDRESS as `0x${string}`,
          functionName: "getCandidates",
        });
        const [names, parties, logos, votes] = res as [
          string[],
          string[],
          string[],
          bigint[]
        ];
        return (names || []).map((name, i) => ({
          id: i,
          name,
          party: parties?.[i] ?? "",
          partyLogo: logos?.[i] ?? "",
          votes: toNum(votes?.[i]),
          manifesto: "",
        }));
      } catch {
        // fall through to shape B
      }

      // Shape B: getCandidateCount() + candidates(i)
      let count = 0;
      try {
        const c: any = await publicClient.readContract({
          abi: BHARATVOTE_ABI,
          address: BHARATVOTE_ADDRESS as `0x${string}`,
          functionName: "getCandidateCount",
        });
        count = toNum(c);
      } catch {
        count = 4; // fallback to 4 if no counter
      }

      const arr: Array<any> = [];
      for (let i = 0; i < count; i++) {
        try {
          const cand: any = await publicClient.readContract({
            abi: BHARATVOTE_ABI,
            address: BHARATVOTE_ADDRESS as `0x${string}`,
            functionName: "candidates",
            args: [BigInt(i)],
          });
          const name = String(cand?.name ?? cand?.[0] ?? "");
          const party = String(cand?.party ?? cand?.[1] ?? "");
          const logo = String(cand?.logoUrl ?? cand?.[2] ?? "");
          const votes = toNum(cand?.votes ?? cand?.[3] ?? 0n);
          arr.push({ id: i, name, party, partyLogo: logo, votes, manifesto: "" });
        } catch {
          break;
        }
      }
      return arr;
    },
    refetchInterval: 5000, // live-ish updates (others' votes)
    staleTime: 0,
  });

  // ---------- WRITE: vote ----------
  const { writeContractAsync } = useWriteContract();

  async function vote(candidateIndex: number) {
    if (!publicClient) throw new Error("No public client");
    const hash = await writeContractAsync({
      abi: BHARATVOTE_ABI,
      address: BHARATVOTE_ADDRESS as `0x${string}`,
      functionName: "vote",
      args: [BigInt(candidateIndex)],
      chainId: polygonAmoy.id,
      account: address as `0x${string}` | undefined,
    });
    setPendingTx(hash);

    // Wait for inclusion / success
    await publicClient.waitForTransactionReceipt({ hash });
    setPendingTx(null);

    // Strong refresh: invalidate + refetch (twice to beat RPC lag)
    await queryClient.invalidateQueries({
      queryKey: ["bharatvote", "candidates"],
    });
    await refetch();
    setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ["bharatvote", "candidates"] });
      refetch();
    }, 1200);

    return hash;
  }

  // ---------- EVENTS: refresh on Voted(address,uint256) if present ----------
  useWatchContractEvent({
    abi: BHARATVOTE_ABI,
    address: BHARATVOTE_ADDRESS as `0x${string}`,
    eventName: "Voted",
    chainId: 80002,
    onLogs() {
      queryClient.invalidateQueries({ queryKey: ["bharatvote", "candidates"] });
      refetch();
    },
  });

  return {
    candidates,
    isConnected: !!isConnected && (chainId === 80002 || chainId === polygonAmoy.id),
    walletAddress: address ?? "",
    connectWallet: () => {}, // your WalletConnect button handles this
    vote,
    pendingTx,
  };
}
