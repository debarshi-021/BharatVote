"use client"

/**
 * WalletConnect Component
 * Handles wallet connection functionality with placeholder implementation
 */

interface WalletConnectProps {
  isConnected: boolean
  walletAddress: string
  onConnect: () => void
}

export default function WalletConnect({ isConnected, walletAddress, onConnect }: WalletConnectProps) {
  return (
    <div className="bg-card rounded-lg p-6 text-center">
      <h2 className="text-xl font-semibold mb-4 text-card-foreground">Wallet Connection</h2>

      {!isConnected ? (
        <div>
          <p className="text-muted-foreground mb-4">Connect your wallet to participate in voting</p>
          <button
            onClick={onConnect}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-accent transition-colors font-medium"
          >
            Connect Wallet
          </button>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-center mb-4">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-card-foreground font-medium">Wallet Connected</span>
          </div>
          <p className="text-muted-foreground">
            Address: <span className="font-mono text-foreground">{walletAddress}</span>
          </p>
        </div>
      )}
    </div>
  )
}
