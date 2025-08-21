"use client";

import { useState, useEffect } from "react";
import { useBharatVote } from '@/hooks/useBharatVote';
import { Candidate } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminPanel() {
  const { candidates, admin, userAddress, addCandidate, isConfirmed, refetchCandidates } = useBharatVote();
  const [newCandidateName, setNewCandidateName] = useState('');
  const [newCandidateParty, setNewCandidateParty] = useState('');
  const [newCandidateLogoUrl, setNewCandidateLogoUrl] = useState('');

  useEffect(() => {
    if (isConfirmed) {
      refetchCandidates();
      setNewCandidateName('');
      setNewCandidateParty('');
      setNewCandidateLogoUrl('');
    }
  }, [isConfirmed, refetchCandidates]);

  const handleAddCandidate = async () => {
    if (newCandidateName && newCandidateParty && newCandidateLogoUrl) {
      await addCandidate(newCandidateName, newCandidateParty, newCandidateLogoUrl);
    }
  };

  const totalVotes = candidates ? candidates.reduce((sum, candidate) => sum + candidate.voteCount, 0n) : 0n;

  if (userAddress !== admin) {
    return null;
  }

  return (
    <div className="bg-sidebar rounded-lg p-6 border border-sidebar-border">
      <h2 className="text-2xl font-bold mb-6 text-sidebar-foreground">Admin Panel</h2>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">Add New Candidate</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            type="text"
            placeholder="Candidate Name"
            value={newCandidateName}
            onChange={(e) => setNewCandidateName(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Candidate Party"
            value={newCandidateParty}
            onChange={(e) => setNewCandidateParty(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Logo URL"
            value={newCandidateLogoUrl}
            onChange={(e) => setNewCandidateLogoUrl(e.target.value)}
          />
        </div>
        <Button onClick={handleAddCandidate} className="mt-4">
          Add Candidate
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-sidebar-accent rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-sidebar-primary">{candidates ? candidates.length : 0}</p>
          <p className="text-sidebar-foreground">Total Candidates</p>
        </div>
        <div className="bg-sidebar-accent rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-sidebar-primary">{totalVotes.toString()}</p>
          <p className="text-sidebar-foreground">Total Votes</p>
        </div>
        <div className="bg-sidebar-accent rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-sidebar-primary">
            {candidates && candidates.length > 0
              ? (totalVotes / BigInt(candidates.length)).toString()
              : '0'}
          </p>
          <p className="text-sidebar-foreground">Avg Votes/Candidate</p>
        </div>
      </div>

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
                <td className="p-2 text-sidebar-foreground">{candidate.name}</td>
                <td className="p-2 text-sidebar-primary font-semibold">{candidate.voteCount.toString()}</td>
                <td className="p-2 text-sidebar-foreground">
                  {totalVotes > 0n ? `${(candidate.voteCount * 100n) / totalVotes}%` : '0%'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
