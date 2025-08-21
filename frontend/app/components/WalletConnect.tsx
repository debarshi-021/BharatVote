"use client";

import { useState } from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useSwitchChain,
} from "wagmi";

function short(addr?: string) {
  return addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : "";
}

/**
 * WalletConnect (wagmi v2)
 * - Uses connectors from wagmi config (MetaMask preferred)
 * - Auto-switches to Polygon Amoy (80002)
 * - Robust: no "connector undefined" crash
 */
export default function WalletConnect() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { address, isConnected, chainId, status } = useAccount();

  const {
    connectors,            // <- read from config
    connect,               // <- call with { connector }
    isPending: isConnecting,
  } = useConnect({
    mutation: { onMutate: () => setErrorMsg(null) },
  });

  const { disconnect } = useDisconnect();
  const { switchChainAsync, isPending: isSwitching } = useSwitchChain({
    mutation: { onMutate: () => setErrorMsg(null) },
  });

  const AMOY_ID = 80002;

  // pick MetaMask first; otherwise first available connector
  const pickConnector = () => {
    const mm = connectors.find((c) =>
      // common ids: 'io.metamask', 'injected'
      c.id?.toLowerCase?.().includes("metamask") ||
      c.name?.toLowerCase?.().includes("metamask")
    );
    return mm ?? connectors[0];
  };

  async function handleConnect() {
    try {
      const connector = pickConnector();
      if (!connector) {
        setErrorMsg("No compatible wallet connector found. Install MetaMask.");
        return;
      }
      await connect({ connector });
      // ensure Amoy
      if (chainId !== AMOY_ID) {
        await switchChainAsync({ chainId: AMOY_ID });
      }
    } catch (err: any) {
      const msg =
        err?.shortMessage ||
        err?.message ||
        "Failed to connect. Check MetaMask is installed & unlocked.";
      setErrorMsg(msg);
    }
  }

  async function handleSwitchToAmoy() {
    try {
      await switchChainAsync({ chainId: AMOY_ID });
    } catch (err: any) {
      const msg =
        err?.shortMessage ||
        err?.message ||
        "Failed to switch network. Add Polygon Amoy in MetaMask and try again.";
      setErrorMsg(msg);
    }
  }

  return (
    <div className="bg-card rounded-lg p-6 text-center border border-border">
      <h2 className="text-xl font-semibold mb-4 text-card-foreground">Wallet Connection</h2>

      {!isConnected ? (
        <div>
          <p className="text-muted-foreground mb-4">
            Connect your wallet to participate in voting on Polygon Amoy.
          </p>
          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-accent transition-colors font-medium disabled:opacity-60"
          >
            {isConnecting ? "Connecting…" : "Connect Wallet"}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {chainId !== AMOY_ID ? (
            <div className="bg-yellow-50 text-yellow-900 p-3 rounded-lg border border-yellow-200">
              <p className="font-medium mb-2">Wrong network</p>
              <p className="text-sm mb-3">
                You are on chain <span className="font-mono">{chainId}</span>. Switch to{" "}
                <span className="font-mono">Polygon Amoy (80002)</span>.
              </p>
              <button
                onClick={handleSwitchToAmoy}
                disabled={isSwitching}
                className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-accent transition-colors disabled:opacity-60"
              >
                {isSwitching ? "Switching…" : "Switch to Amoy"}
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-card-foreground font-medium">
                Connected: <span className="font-mono">{short(address)}</span>
              </span>
            </div>
          )}

          <div>
            <button
              onClick={() => disconnect()}
              className="mt-2 bg-muted text-foreground px-4 py-2 rounded-lg hover:bg-accent transition-colors"
            >
              Disconnect
            </button>
          </div>
        </div>
      )}

      {errorMsg && (
        <p className="mt-4 text-sm text-red-600 whitespace-pre-wrap">{errorMsg}</p>
      )}

      <p className="mt-3 text-xs text-muted-foreground">
        Status: <span className="font-mono">{status}</span>{" "}
        {isConnected && (
          <>
            • Chain: <span className="font-mono">{chainId}</span>
          </>
        )}
      </p>
    </div>
  );
}
