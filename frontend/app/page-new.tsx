"use client"

import { useEffect, useState } from "react"
import Header from "./components/Header"
import WalletConnect from "./components/WalletConnect"
import CandidateList from "./components/CandidateList"
import AdminPanel from "./components/AdminPanel"
import Footer from "./components/Footer"
import { useBharatVote } from "@/hooks/useBharatVote"
import { useAccount } from "wagmi"

interface Candidate {
  id: number
  name: string
  party: string
  partyLogo: string
  votes: number
  manifesto: string
}

// Party logos mapping
const partyLogos: { [key: string]: string } = {
  "Indian National Congress": "/indian-national-congress-logo.png",
  "Bharatiya Janata Party": "/bjp-logo.png",
  "Aam Aadmi Party": "/aap-party-logo.png",
  "Independent": "/independent-candidate-symbol.png",
}

export default function BharatVote() {
  const { candidates: contractCandidates, loading, vote, refresh } = useBharatVote()
  const { isConnected, address } = useAccount()
  
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [showAdmin, setShowAdmin] = useState(false)

  // Transform contract data to UI format
  useEffect(() => {
    if (!loading && contractCandidates.length > 0) {
      const transformedCandidates = contractCandidates.map((candidate, index) => ({
        id: index,
        name: candidate.name,
        party: "Independent", // Default, can be enhanced later
        partyLogo: partyLogos["Independent"],
        votes: Number(candidate.voteCount),
        manifesto: `Campaigning for better governance and development`, // Default manifesto
      }))

      // Update party logos based on candidate names
      transformedCandidates.forEach(candidate => {
        if (candidate.name.toLowerCase().includes("congress")) {
          candidate.party = "Indian National Congress"
          candidate.partyLogo = partyLogos["Indian National Congress"]
        } else if (candidate.name.toLowerCase().includes("bjp") || candidate.name.toLowerCase().includes("modi")) {
          candidate.party = "Bharatiya Janata Party"
          candidate.partyLogo = partyLogos["Bharatiya Janata Party"]
        } else if (candidate.name.toLowerCase().includes("aap") || candidate.name.toLowerCase().includes("kejriwal")) {
          candidate.party = "Aam Aadmi Party"
          candidate.partyLogo = partyLogos["Aam Aadmi Party"]
        }
      })

      setCandidates(transformedCandidates)
    }
  }, [contractCandidates, loading])

  // Handle vote with real blockchain interaction
  const handleVote = async (candidateId: number) => {
    if (!isConnected) {
      alert("Please connect your wallet first!")
      return
    }

    try {
      await vote(candidateId)
      alert("Vote cast successfully! Transaction confirmed.")
      // Data will be refreshed automatically by the hook
    } catch (error) {
      console.error("Error casting vote:", error)
      alert("Error casting vote. Please try again.")
    }
  }

  // Function to add new candidate (admin only)
  const addCandidate = (newCandidate: any) => {
    // This would need to be implemented via smart contract
    console.log("Adding candidate:", newCandidate)
    alert("Adding candidates requires smart contract interaction - implement via admin panel")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading candidates from blockchain...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Wallet Connection Section */}
        <div className="mb-8">
          <WalletConnect />
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
          <CandidateList 
            candidates={candidates} 
            onVote={handleVote} 
            walletConnected={isConnected} 
          />
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

      <Footer
