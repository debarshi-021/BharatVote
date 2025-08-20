"use client"

/**
 * CandidateCard Component
 * Displays individual candidate information with voting functionality
 */

import { Candidate } from "@/lib/contract-interactions";

interface CandidateWithId extends Candidate {
  id: number;
}

interface CandidateCardProps {
  candidate: CandidateWithId;
  onVote: (candidateId: number) => void;
  walletConnected: boolean;
  hasVoted: boolean;
  voting: boolean;
}

export default function CandidateCard({
  candidate,
  onVote,
  walletConnected,
  hasVoted,
  voting,
}: CandidateCardProps) {
  return (
    <div className="bg-card rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow border border-border">
      <div className="flex items-center mb-4">
        <img
          src={`/${candidate.logoUrl}`}
          alt={`${candidate.name} logo`}
          className="w-12 h-12 mr-4"
        />
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-card-foreground">
            {candidate.name}
          </h3>
          <p className="text-sm text-muted-foreground">{candidate.party}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-center">
          <p className="text-2xl font-bold text-primary">
            {candidate.voteCount.toString()}
          </p>
          <p className="text-sm text-muted-foreground">Votes</p>
        </div>

        <button
          onClick={() => onVote(candidate.id)}
          disabled={!walletConnected || hasVoted || voting}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            walletConnected && !hasVoted && !voting
              ? "bg-primary text-primary-foreground hover:bg-accent"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          }`}
        >
          {voting ? "Voting..." : hasVoted ? "Voted" : "Vote"}
        </button>
      </div>
    </div>
  )
}
