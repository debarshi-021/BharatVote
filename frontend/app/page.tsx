"use client"

import { useState } from "react"
import Header from "./components/Header"
import WalletConnect from "./components/WalletConnect"
import CandidateList from "./components/CandidateList"
import AdminPanel from "./components/AdminPanel"
import Footer from "./components/Footer"

// Placeholder candidate data
const initialCandidates = [
  {
    id: 1,
    name: "Rajesh Kumar",
    party: "Indian National Congress",
    partyLogo: "/indian-national-congress-logo.png",
    votes: 1250,
    manifesto: "Focus on education, healthcare, and rural development",
  },
  {
    id: 2,
    name: "Priya Sharma",
    party: "Bharatiya Janata Party",
    partyLogo: "/bjp-logo.png",
    votes: 1180,
    manifesto: "Digital India, infrastructure development, and job creation",
  },
  {
    id: 3,
    name: "Amit Singh",
    party: "Aam Aadmi Party",
    partyLogo: "/aap-party-logo.png",
    votes: 890,
    manifesto: "Anti-corruption, free utilities, and transparent governance",
  },
  {
    id: 4,
    name: "Sunita Devi",
    party: "Independent",
    partyLogo: "/independent-candidate-symbol.png",
    votes: 650,
    manifesto: "Women empowerment, environmental protection, and local issues",
  },
]

export default function BharatVote() {
  const [candidates, setCandidates] = useState(initialCandidates)
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [showAdmin, setShowAdmin] = useState(false)

  // Placeholder function to handle voting
  const handleVote = (candidateId: number) => {
    if (!walletConnected) {
      alert("Please connect your wallet first!")
      return
    }

    setCandidates((prev) =>
      prev.map((candidate) =>
        candidate.id === candidateId ? { ...candidate, votes: candidate.votes + 1 } : candidate,
      ),
    )
    alert("Vote cast successfully!")
  }

  // Placeholder function to connect wallet
  const handleWalletConnect = () => {
    setWalletConnected(true)
    setWalletAddress("0x1234...5678") // Placeholder address
  }

  // Function to add new candidate (admin only)
  const addCandidate = (newCandidate: any) => {
    const candidate = {
      ...newCandidate,
      id: candidates.length + 1,
      votes: 0,
      partyLogo: "/placeholder.svg?height=60&width=60&query=" + encodeURIComponent(newCandidate.party + " logo"),
    }
    setCandidates((prev) => [...prev, candidate])
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Wallet Connection Section */}
        <div className="mb-8">
          <WalletConnect isConnected={walletConnected} walletAddress={walletAddress} onConnect={handleWalletConnect} />
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
          <h2 className="text-3xl font-bold text-center mb-8 text-foreground">Cast Your Vote</h2>
          <CandidateList candidates={candidates} onVote={handleVote} walletConnected={walletConnected} />
        </div>

        {/* Vote Statistics */}
        <div className="bg-card rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4 text-card-foreground">Live Vote Count</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {candidates.map((candidate) => (
              <div key={candidate.id} className="text-center">
                <p className="font-medium text-foreground">{candidate.name}</p>
                <p className="text-2xl font-bold text-primary">{candidate.votes}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <p className="text-muted-foreground">
              Total Votes: {candidates.reduce((sum, candidate) => sum + candidate.votes, 0)}
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
