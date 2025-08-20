/**
 * CandidateList Component
 * Renders a responsive grid of candidate cards
 */

import CandidateCard from "./CandidateCard";
import { Candidate } from "@/lib/contract-interactions";

interface CandidateWithId extends Candidate {
  id: number;
}

interface CandidateListProps {
  candidates: CandidateWithId[];
  onVote: (candidateId: number) => void;
  walletConnected: boolean;
  hasVoted: boolean;
  voting: boolean;
}

export default function CandidateList({
  candidates,
  onVote,
  walletConnected,
  hasVoted,
  voting,
}: CandidateListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {candidates.map((candidate) => (
        <CandidateCard
          key={candidate.id}
          candidate={candidate}
          onVote={onVote}
          walletConnected={walletConnected}
          hasVoted={hasVoted}
          voting={voting}
        />
      ))}
    </div>
  );
}
