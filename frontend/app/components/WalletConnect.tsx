"use client";

import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function WalletConnect() {
  return (
    <div className="bg-card rounded-lg p-6 text-center">
      <h2 className="text-xl font-semibold mb-4 text-card-foreground">Wallet Connection</h2>
      <div className="flex justify-center">
        <ConnectButton />
      </div>
    </div>
  );
}
