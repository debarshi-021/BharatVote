"use client";

import { useBharatVote } from '@/hooks/useBharatVote';
import { Candidate } from '@/lib/types';
import { Button } from '@/components/ui/button';

interface CandidateCardProps {
  candidate: Candidate;
  id: number;
}

export default function CandidateCard({ candidate, id }: CandidateCardProps) {
  const { castVote, isConnected, isConfirming } = useBharatVote();

  return (
    <div className="bg-card rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow border border-border">
      <div className="flex items-center mb-4">
        <img
          src={candidate.logoUrl}
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

        <Button
          onClick={() => castVote(id)}
          disabled={!isConnected || isConfirming}
        >
          {isConfirming ? 'Voting...' : 'Vote'}
        </Button>
      </div>
    </div>
  );
}
