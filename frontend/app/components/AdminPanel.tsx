"use client"

import type React from "react"

/**
 * AdminPanel Component
 * Allows administrators to manage candidates and view voting statistics
 */

import { useState } from "react"

import { Candidate } from "@/lib/contract-interactions";

interface AdminPanelProps {
  candidates: Candidate[];
  onAddCandidate: (candidate: any) => void;
}

export default function AdminPanel({
  candidates,
  onAddCandidate,
}: AdminPanelProps) {
  const totalVotes = candidates.reduce(
    (sum, candidate) => sum + BigInt(candidate.voteCount),
    BigInt(0)
  );

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
            {candidates.length > 0
              ? (
                  totalVotes / BigInt(candidates.length)
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
            {candidates.map((candidate, index) => (
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
                        (BigInt(candidate.voteCount) * BigInt(100)) /
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
