import { useState, useEffect } from 'react';
import { useAccount, useSigner, useProvider } from 'wagmi';
import { ethers } from 'ethers';
import { 
  getCandidates, 
  voteForCandidate, 
  checkIfVoted, 
  getElectionName,
  Candidate 
} from '@/lib/contract-interactions';

export function useBharatVote() {
  const { address, isConnected } = useAccount();
  const { data: signer } = useSigner();
  const provider = useProvider();
  
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [electionName, setElectionName] = useState<string>('');
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [voting, setVoting] = useState<boolean>(false);

  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [candidatesData, electionNameData, votedStatus] = await Promise.all([
        getCandidates(),
        getElectionName(),
        address ? checkIfVoted(address, provider) : Promise.resolve(false)
      ]);
      
      setCandidates(candidatesData);
      setElectionName(electionNameData);
      setHasVoted(votedStatus);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Vote for a candidate
  const vote = async (candidateIndex: number) => {
    if (!signer || !address) {
      throw new Error('Wallet not connected');
    }

    try {
      setVoting(true);
      const txHash = await voteForCandidate(candidateIndex, signer);
      
      // Refresh data after voting
      await fetchData();
      
      return txHash;
    } catch (error) {
      console.error('Error voting:', error);
      throw error;
    } finally {
      setVoting(false);
    }
  };

  // Refresh data periodically
  useEffect(() => {
    if (isConnected) {
      fetchData();
      
      // Refresh every 10 seconds
      const interval = setInterval(fetchData, 10000);
      
      return () => clearInterval(interval);
    }
  }, [address, isConnected]);

  return {
    candidates,
    electionName,
    hasVoted,
    loading,
    voting,
    vote,
    refresh: fetchData
  };
}
