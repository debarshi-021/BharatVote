"use client"

/**
 * CandidateCard Component
 * Displays individual candidate information with voting functionality
 */

interface Candidate {
  id: number
  name: string
  party: string
  partyLogo: string
  votes: number
  manifesto: string
}

interface CandidateCardProps {
  candidate: Candidate
  onVote: (candidateId: number) => void
  walletConnected: boolean
}

export default function CandidateCard({ candidate, onVote, walletConnected }: CandidateCardProps) {
  return (
    <div className="bg-card rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow border border-border">
      <div className="flex items-center mb-4">
        <img
          src={candidate.partyLogo || "/placeholder.svg"}
          alt={`${candidate.party} logo`}
          className="w-16 h-16 rounded-full mr-4 object-cover"
        />
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-card-foreground">{candidate.name}</h3>
          <p className="text-muted-foreground">{candidate.party}</p>
        </div>
      </div>

      <p className="text-foreground mb-4 text-sm leading-relaxed">{candidate.manifesto}</p>

      <div className="flex items-center justify-between">
        <div className="text-center">
          <p className="text-2xl font-bold text-primary">{candidate.votes}</p>
          <p className="text-sm text-muted-foreground">Votes</p>
        </div>

        <button
          onClick={() => onVote(candidate.id)}
          disabled={!walletConnected}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            walletConnected
              ? "bg-primary text-primary-foreground hover:bg-accent"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          }`}
        >
          Vote
        </button>
      </div>
    </div>
  )
}
