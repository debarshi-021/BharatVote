"use client";

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { Button } from '@/components/ui/button';

export default function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <div className="bg-card rounded-lg p-6 text-center">
        <h2 className="text-xl font-semibold mb-4 text-card-foreground">Wallet Connected</h2>
        <p className="mb-4">Connected as: {address}</p>
        <Button onClick={() => disconnect()}>Disconnect</Button>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg p-6 text-center">
      <h2 className="text-xl font-semibold mb-4 text-card-foreground">Connect Wallet</h2>
      <Button onClick={() => connect({ connector: injected() })}>
        Connect with MetaMask
      </Button>
    </div>
  );
}
