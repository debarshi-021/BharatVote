import { useReadContract, useWriteContract, useAccount } from 'wagmi';
import { contractAddress } from '@/lib/config';
import BharatVoteABI from '@/../backend/artifacts/contracts/BharatVote.sol/BharatVote.json';
import { Candidate } from '@/lib/types';

export const useBharatVote = () => {
  const { address } = useAccount();

  const { data: candidates, refetch: refetchCandidates } = useReadContract({
    address: contractAddress,
    abi: BharatVoteABI.abi,
    functionName: 'getAllCandidates',
  });

  const { writeContract: vote } = useWriteContract();

  const castVote = (candidateId: number) => {
    vote({
      address: contractAddress,
      abi: BharatVoteABI.abi,
      functionName: 'vote',
      args: [candidateId],
    });
  };

  return {
    candidates: candidates as Candidate[] | undefined,
    refetchCandidates,
    castVote,
    isConnected: !!address,
  };
};
