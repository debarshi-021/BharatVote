"use client"

import type React from "react"

/**
 * AdminPanel Component
 * Allows administrators to manage candidates and view voting statistics
 */

import { useState } from "react"

interface Candidate {
  id: number
  name: string
  party: string
  partyLogo: string
  votes: number
  manifesto: string
}

interface AdminPanelProps {
  candidates: Candidate[]
  onAddCandidate: (candidate: any) => void
}

export default function AdminPanel({ candidates, onAddCandidate }: AdminPanelProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newCandidate, setNewCandidate] = useState({
    name: "",
    party: "",
    manifesto: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newCandidate.name && newCandidate.party && newCandidate.manifesto) {
      onAddCandidate(newCandidate)
      setNewCandidate({ name: "", party: "", manifesto: "" })
      setShowAddForm(false)
      alert("Candidate added successfully!")
    }
  }

  const totalVotes = candidates.reduce((sum, candidate) => sum + candidate.votes, 0)

  return (
    <div className="bg-sidebar rounded-lg p-6 border border-sidebar-border">
      <h2 className="text-2xl font-bold mb-6 text-sidebar-foreground">Admin Panel</h2>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-sidebar-accent rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-sidebar-primary">{candidates.length}</p>
          <p className="text-sidebar-foreground">Total Candidates</p>
        </div>
        <div className="bg-sidebar-accent rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-sidebar-primary">{totalVotes}</p>
          <p className="text-sidebar-foreground">Total Votes</p>
        </div>
        <div className="bg-sidebar-accent rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-sidebar-primary">
            {candidates.length > 0 ? Math.round((totalVotes / candidates.length) * 100) / 100 : 0}
          </p>
          <p className="text-sidebar-foreground">Avg Votes/Candidate</p>
        </div>
      </div>

      {/* Add Candidate Section */}
      <div className="mb-6">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-sidebar-primary text-sidebar-primary-foreground px-4 py-2 rounded-lg hover:bg-sidebar-accent transition-colors"
        >
          {showAddForm ? "Cancel" : "Add New Candidate"}
        </button>
      </div>

      {/* Add Candidate Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-sidebar-accent rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sidebar-foreground mb-2">Candidate Name</label>
              <input
                type="text"
                value={newCandidate.name}
                onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
                className="w-full p-2 rounded border border-sidebar-border bg-background text-foreground"
                required
              />
            </div>
            <div>
              <label className="block text-sidebar-foreground mb-2">Party</label>
              <input
                type="text"
                value={newCandidate.party}
                onChange={(e) => setNewCandidate({ ...newCandidate, party: e.target.value })}
                className="w-full p-2 rounded border border-sidebar-border bg-background text-foreground"
                required
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sidebar-foreground mb-2">Manifesto</label>
            <textarea
              value={newCandidate.manifesto}
              onChange={(e) => setNewCandidate({ ...newCandidate, manifesto: e.target.value })}
              className="w-full p-2 rounded border border-sidebar-border bg-background text-foreground h-20"
              required
            />
          </div>
          <button
            type="submit"
            className="mt-4 bg-sidebar-primary text-sidebar-primary-foreground px-6 py-2 rounded-lg hover:bg-sidebar-accent transition-colors"
          >
            Add Candidate
          </button>
        </form>
      )}

      {/* Candidate Management Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-sidebar-border">
              <th className="text-left p-2 text-sidebar-foreground">Name</th>
              <th className="text-left p-2 text-sidebar-foreground">Party</th>
              <th className="text-left p-2 text-sidebar-foreground">Votes</th>
              <th className="text-left p-2 text-sidebar-foreground">Vote %</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate) => (
              <tr key={candidate.id} className="border-b border-sidebar-border">
                <td className="p-2 text-sidebar-foreground">{candidate.name}</td>
                <td className="p-2 text-sidebar-foreground">{candidate.party}</td>
                <td className="p-2 text-sidebar-primary font-semibold">{candidate.votes}</td>
                <td className="p-2 text-sidebar-foreground">
                  {totalVotes > 0 ? ((candidate.votes / totalVotes) * 100).toFixed(1) : 0}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
