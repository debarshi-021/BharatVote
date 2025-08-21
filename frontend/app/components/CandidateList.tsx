"use client";

import { useEffect } from 'react';
import { useBharatVote } from '@/hooks/useBharatVote';
import CandidateCard from "./CandidateCard";
import { Candidate } from '@/lib/types';

export default function CandidateList() {
  const { candidates, isConfirmed, refetchCandidates } = useBharatVote();

  useEffect(() => {
    if (isConfirmed) {
      refetchCandidates();
    }
  }, [isConfirmed, refetchCandidates]);

  if (!candidates) {
    return <div>Loading candidates...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {candidates.map((candidate: Candidate, index: number) => (
        <CandidateCard
          key={index}
          candidate={candidate}
          id={index}
        />
      ))}
    </div>
  );
}
