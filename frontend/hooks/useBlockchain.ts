import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { 
  getCandidates, 
  voteForCandidate, 
  checkIfVoted, 
  getElectionName,
  Candidate 
} from '@/lib/contract-utils';

export function useBlockchain() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [electionName, setElectionName] = useState<string>('');
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [voting, setVoting] = useState<boolean>(false);
  const [account, setAccount] = useState<string>('');
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);

  // Connect wallet
  const connectWallet = async () => {
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send('eth_requestAccounts', []);
        
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setProvider(provider);
          const signer = await provider.getSigner();
          setSigner(signer);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      return false;
    }
  };

  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [candidatesData, electionNameData] = await Promise.all([
        getCandidates(),
        getElectionName()
      ]);
      
      setCandidates(candidatesData);
      setElectionName(electionNameData);
      
      // Check if user has voted
      if (account) {
        const voted = await checkIfVoted(account, new ethers.JsonRpcProvider('https://rpc-amoy.polygon.technology'));
        setHasVoted(voted);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Vote for a candidate
  const vote = async (candidateIndex: number) => {
    if (!signer || !account) {
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

  // Auto-connect on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      checkConnection();
    }
  }, []);

  const checkConnection = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.listAccounts();
      
      if (accounts.length > 0) {
        setAccount(accounts[0].address);
        setProvider(provider);
        const signer = await provider.getSigner();
        setSigner(signer);
      }
    } catch (error) {
      console.error('Error checking connection:', error);
    }
  };

  // Fetch data when connected
  useEffect(() => {
    if (account) {
      fetchData();
      
      // Refresh every 10 seconds
      const interval = setInterval(fetchData, 10000);
      
      return () => clearInterval(interval);
    }
  }, [account]);

  return {
    candidates,
    electionName,
    hasVoted,
    loading,
    voting,
    account,
    connectWallet,
    vote,
    refresh: fetchData
  };
}
