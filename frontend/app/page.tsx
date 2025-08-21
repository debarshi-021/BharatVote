"use client";

import { useEffect, useState } from "react";
import Header from "./components/Header";
import WalletConnect from "./components/WalletConnect";
import CandidateList from "./components/CandidateList";
import AdminPanel from "./components/AdminPanel";
import Footer from "./components/Footer";

// 🔌 on-chain integration
import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "../lib/wagmi";
import { useBharatVote } from "../hooks/useBharatVote";

// React Query client (used to force-refresh tallies)
//import { queryClient } from "../lib/query";

export default function BharatVote() {
  const [showAdmin, setShowAdmin] = useState(false);

  // ✅ prevent hydration mismatch: render only after mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // 👇 from blockchain (names, parties, logos, votes)
  const {
    candidates, // [{ id, name, party, partyLogo, votes, manifesto }]
    isConnected,
    walletAddress,
    connectWallet,
    vote,
    pendingTx,
    // If your hook exposes a refetch, you can also use it:
    // refetchCandidates,
  } = useBharatVote();

  // ---------- helpers (DPs + numbers) ----------
  const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || "").trim();

  // robust logo normalizer for Vercel/Linux paths
  const normalizeLogo = (s?: string) => {
    let t = (s ?? "").trim();
    if (!t) return `${basePath}/placeholder.svg`;

    if (!t.startsWith("http") && !t.startsWith("/")) {
      t = t.replace(/\s+/g, "-").toLowerCase(); // "Indian National Congress.png" -> "indian-national-congress.png"
      t = `/${t}`;
    }
    return basePath ? `${basePath}${t}` : t;
  };

  // robust number coercion for bigint/undefined
  const toInt = (v: any) => {
    if (typeof v === "bigint") return Number(v);
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  // ---------- adapt on-chain to UI props ----------
  const uiCandidates = candidates.map((c) => ({
    id: c.id, // 0-based index (works with contract's vote(uint))
    name: (c.name ?? "").toString(),
    party: (c.party ?? "").toString(),
    partyLogo: normalizeLogo(c.partyLogo),
    votes: toInt(c.votes),
    manifesto: (c.manifesto ?? "").toString(),
  }));

  const handleVote = async (candidateId: number) => {
  if (!isConnected) {
    alert("Please connect your wallet first!");
    return;
  }
  try {
    const txHash = await vote(candidateId);
    alert("Vote cast successfully!\n" + (txHash ? `Tx: ${txHash}` : ""));
  } catch (e: any) {
    alert(e?.shortMessage || e?.message || "Vote failed");
  }
};



  const addCandidate = (_newCandidate: any) => {
    // Your deployed contract does not support adding candidates post-deploy.
    alert("On-chain add is disabled in this deployment.");
  };

  return (
    <WagmiProvider config={wagmiConfig}>
      {/* avoid SSR/client HTML mismatch */}
      {!mounted ? null : (
        <div className="min-h-screen bg-background">
          <Header />

          <main className="container mx-auto px-4 py-8">
            {/* Wallet Connection Section */}
            <div className="mb-8">
              <WalletConnect
                isConnected={isConnected}
                walletAddress={walletAddress}
                onConnect={connectWallet}
              />
              {pendingTx && (
                <p className="mt-2 text-sm">
                  Tx sent:{" "}
                  <a
                    className="underline"
                    target="_blank"
                    href={`https://amoy.polygonscan.com/tx/${pendingTx}`}
                  >
                    {pendingTx}
                  </a>
                </p>
              )}
            </div>

            {/* Admin Toggle */}
            <div className="mb-6 text-center">
              <button
                onClick={() => setShowAdmin(!showAdmin)}
                className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-accent transition-colors"
              >
                {showAdmin ? "Hide Admin Panel" : "Show Admin Panel"}
              </button>
            </div>

            {/* Admin Panel (read-only stats here) */}
            {showAdmin && (
              <div className="mb-8">
                <AdminPanel candidates={uiCandidates} onAddCandidate={addCandidate} />
              </div>
            )}

            {/* Voting Section */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-center mb-8 text-foreground">Cast Your Vote</h2>
              <CandidateList
                candidates={uiCandidates}
                onVote={handleVote}
                walletConnected={isConnected}
              />
            </div>

            {/* Vote Statistics */}
            <div className="bg-card rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4 text-card-foreground">Live Vote Count</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {uiCandidates.map((candidate) => (
                  <div key={candidate.id} className="text-center">
                    <p className="font-medium text-foreground">{candidate.name}</p>
                    <p className="text-2xl font-bold text-primary">{candidate.votes}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <p className="text-muted-foreground">
                  Total Votes: {uiCandidates.reduce((sum, c) => sum + c.votes, 0)}
                </p>
              </div>
            </div>
          </main>

          <Footer />
        </div>
      )}
    </WagmiProvider>
  );
}
