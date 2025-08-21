"use client";

import Header from "./components/Header";
import WalletConnect from "./components/WalletConnect";
import CandidateList from "./components/CandidateList";
import AdminPanel from "./components/AdminPanel";
import Footer from "./components/Footer";
import { useBharatVote } from "@/hooks/useBharatVote";

export default function BharatVote() {
  const { admin, userAddress } = useBharatVote();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <WalletConnect />
        </div>

        {admin === userAddress && (
          <div className="mb-8">
            <AdminPanel />
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-center mb-8 text-foreground">
            Candidates
          </h2>
          <CandidateList />
        </div>
      </main>

      <Footer />
    </div>
  );
}
