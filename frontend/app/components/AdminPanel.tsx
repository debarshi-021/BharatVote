"use client";

import { useState } from "react";
import { useBharatVote } from '@/hooks/useBharatVote';
import { useAccount } from "wagmi";
import { Candidate } from "@/lib/types";

// TODO: Replace with the actual admin address from the deployed contract
const ADMIN_ADDRESS = '0xYourAdminAddressHere';

export default function AdminPanel() {
  const { candidates, refetchCandidates } = useBharatVote();
  const { address } = useAccount();
  const [newCandidateName, setNewCandidateName] = useState('');
  const [newCandidateParty, setNewCandidateParty] = useState('');
  const [newCandidateLogoUrl, setNewCandidateLogoUrl] = useState('');

  const handleAddCandidate = async () => {
    // TODO: Implement addCandidate functionality once the smart contract is updated and redeployed
    alert("Add candidate functionality is not yet implemented.");
  };

  const totalVotes = candidates && Array.isArray(candidates)
    ? (candidates as any[]).reduce((sum, candidate) => sum + BigInt(candidate.voteCount), BigInt(0))
    : BigInt(0);

  if (address !== ADMIN_ADDRESS) {
    return null; // Don't render the admin panel if the user is not the admin
  }

  return (
    <div className="bg-sidebar rounded-lg p-6 border border-sidebar-border">
      <h2 className="text-2xl font-bold mb-6 text-sidebar-foreground">Admin Panel</h2>

      {/* Add Candidate Form */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">Add New Candidate</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Candidate Name"
            value={newCandidateName}
            onChange={(e) => setNewCandidateName(e.target.value)}
            className="bg-sidebar-accent rounded-lg p-2"
          />
          <input
            type="text"
            placeholder="Candidate Party"
            value={newCandidateParty}
            onChange={(e) => setNewCandidateParty(e.target.value)}
            className="bg-sidebar-accent rounded-lg p-2"
          />
          <input
            type="text"
            placeholder="Logo URL"
            value={newCandidateLogoUrl}
            onChange={(e) => setNewCandidateLogoUrl(e.target.value)}
            className="bg-sidebar-accent rounded-lg p-2"
          />
        </div>
        <button
          onClick={handleAddCandidate}
          className="bg-primary text-primary-foreground px-6 py-2 rounded-lg mt-4"
        >
          Add Candidate
        </button>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-sidebar-accent rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-sidebar-primary">{candidates ? (candidates as any[]).length : 0}</p>
          <p className="text-sidebar-foreground">Total Candidates</p>
        </div>
        <div className="bg-sidebar-accent rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-sidebar-primary">{totalVotes.toString()}</p>
          <p className="text-sidebar-foreground">Total Votes</p>
        </div>
        <div className="bg-sidebar-accent rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-sidebar-primary">
            {candidates && (candidates as any[]).length > 0
              ? (
                  totalVotes / BigInt((candidates as any[]).length)
                ).toString()
              : 0}
          </p>
          <p className="text-sidebar-foreground">Avg Votes/Candidate</p>
        </div>
      </div>


      {/* Candidate Management Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-sidebar-border">
              <th className="text-left p-2 text-sidebar-foreground">Name</th>
              <th className="text-left p-2 text-sidebar-foreground">Votes</th>
              <th className="text-left p-2 text-sidebar-foreground">Vote %</th>
            </tr>
          </thead>
          <tbody>
            {candidates && candidates.map((candidate: Candidate, index: number) => (
              <tr key={index} className="border-b border-sidebar-border">
                <td className="p-2 text-sidebar-foreground">
                  {candidate.name}
                </td>
                <td className="p-2 text-sidebar-primary font-semibold">
                  {candidate.voteCount.toString()}
                </td>
                <td className="p-2 text-sidebar-foreground">
                  {totalVotes > 0
                    ? (
                        (candidate.voteCount * BigInt(100)) /
                        totalVotes
                      ).toString()
                    : 0}
                  %
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
