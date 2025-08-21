import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { contractConfig } from '@/lib/config';
import { Candidate } from '@/lib/types';
import { parseAbiItem } from 'viem';

export const useBharatVote = () => {
  const { address } = useAccount();
  const { writeContractAsync, data: hash } = useWriteContract();

  const { data: candidates, refetch: refetchCandidates } = useReadContract({
    ...contractConfig,
    functionName: 'getAllCandidates',
  });

  const { data: admin } = useReadContract({
    ...contractConfig,
    functionName: 'admin',
  });

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const castVote = async (candidateId: number) => {
    try {
      await writeContractAsync({
        ...contractConfig,
        functionName: 'vote',
        args: [BigInt(candidateId)],
      });
    } catch (error) {
      console.error('Error casting vote:', error);
    }
  };

  const addCandidate = async (name: string, party: string, logoUrl: string) => {
    try {
      await writeContractAsync({
        ...contractConfig,
        functionName: 'addCandidate',
        args: [name, party, logoUrl],
      });
    } catch (error) {
      console.error('Error adding candidate:', error);
    }
  };

  return {
    candidates: candidates as Candidate[] | undefined,
    admin: admin as `0x${string}` | undefined,
    userAddress: address,
    isConnected: !!address,
    isConfirming,
    isConfirmed,
    refetchCandidates,
    castVote,
    addCandidate,
  };
};
