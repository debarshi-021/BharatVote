/**
 * CandidateList Component
 * Renders a responsive grid of candidate cards
 */

import CandidateCard from "./CandidateCard"

interface Candidate {
  id: number
  name: string
  party: string
  partyLogo: string
  votes: number
  manifesto: string
}

interface CandidateListProps {
  candidates: Candidate[]
  onVote: (candidateId: number) => void
  walletConnected: boolean
}

export default function CandidateList({ candidates, onVote, walletConnected }: CandidateListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {candidates.map((candidate) => (
        <CandidateCard key={candidate.id} candidate={candidate} onVote={onVote} walletConnected={walletConnected} />
      ))}
    </div>
  )
}
