"use client";

import { useBharatVote } from '@/hooks/useBharatVote';

// Define a mapping from candidate names to their party and logo
const candidateInfo: { [key: string]: { party: string; logoUrl: string } } = {
  'Narendra Modi': { party: 'Bharatiya Janata Party', logoUrl: '/bjp-logo.png' },
  'Rahul Gandhi': { party: 'Indian National Congress', logoUrl: '/indian-national-congress-logo.png' },
  'Arvind Kejriwal': { party: 'Aam Aadmi Party', logoUrl: '/aap-party-logo.png' },
  'Independent': { party: 'Independent', logoUrl: '/independent-candidate-symbol.png' },
};

import { Candidate } from '@/lib/types';

interface CandidateCardProps {
  candidate: Candidate;
  id: number;
}

export default function CandidateCard({ candidate, id }: CandidateCardProps) {
  const { castVote, isConnected } = useBharatVote();
  const info = candidateInfo[candidate.name] || { party: 'Unknown', logoUrl: '/placeholder-logo.png' };

  return (
    <div className="bg-card rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow border border-border">
      <div className="flex items-center mb-4">
        <img
          src={info.logoUrl}
          alt={`${candidate.name} logo`}
          className="w-12 h-12 mr-4"
        />
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-card-foreground">
            {candidate.name}
          </h3>
          <p className="text-sm text-muted-foreground">{info.party}</p>
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
          onClick={() => castVote(id)}
          disabled={!isConnected}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            isConnected
              ? "bg-primary text-primary-foreground hover:bg-accent"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          }`}
        >
          Vote
        </button>
      </div>
    </div>
  );
}
