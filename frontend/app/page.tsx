"use client"

import { useState } from "react";
import Header from "./components/Header";
import WalletConnect from "./components/WalletConnect";
import CandidateList from "./components/CandidateList";
import AdminPanel from "./components/AdminPanel";
import Footer from "./components/Footer";
import { useBharatVote } from "@/hooks/useBharatVote";
import { useAccount } from "wagmi";

export default function BharatVote() {
  const {
    candidates,
    electionName,
    hasVoted,
    loading,
    voting,
    vote,
    refresh,
  } = useBharatVote();
  const { address, isConnected } = useAccount();
  const [showAdmin, setShowAdmin] = useState(false);

  const handleVote = async (candidateId: number) => {
    if (!isConnected) {
      alert("Please connect your wallet first!");
      return;
    }
    try {
      await vote(candidateId);
      alert("Vote cast successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to cast vote.");
    }
  };

  // Function to add new candidate (admin only) - This is a placeholder and won't work with the smart contract
  const addCandidate = (newCandidate: any) => {
    alert("This functionality is not implemented on the smart contract.");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Wallet Connection Section */}
        <div className="mb-8">
          <WalletConnect
            isConnected={isConnected}
            walletAddress={address || ""}
            onConnect={() => {}}
          />
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

        {/* Admin Panel */}
        {showAdmin && (
          <div className="mb-8">
            <AdminPanel candidates={candidates} onAddCandidate={addCandidate} />
          </div>
        )}

        {/* Voting Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-center mb-8 text-foreground">
            {electionName}
          </h2>
          {loading ? (
            <p className="text-center">Loading candidates...</p>
          ) : (
            <CandidateList
              candidates={candidates.map((c, i) => ({ ...c, id: i }))}
              onVote={handleVote}
              walletConnected={isConnected}
              hasVoted={hasVoted}
              voting={voting}
            />
          )}
        </div>

        {/* Vote Statistics */}
        <div className="bg-card rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4 text-card-foreground">
            Live Vote Count
          </h3>
          {loading ? (
            <p className="text-center">Loading vote counts...</p>
          ) : (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {candidates.map((candidate, index) => (
                  <div key={index} className="text-center">
                    <p className="font-medium text-foreground">
                      {candidate.name}
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      {candidate.voteCount.toString()}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <p className="text-muted-foreground">
                  Total Votes:{" "}
                  {candidates
                    .reduce(
                      (sum, candidate) => sum + BigInt(candidate.voteCount),
                      BigInt(0)
                    )
                    .toString()}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
