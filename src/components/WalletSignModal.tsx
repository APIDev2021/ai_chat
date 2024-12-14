import React, { useState, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Loader2 } from "lucide-react";
import bs58 from "bs58";

const API_BASE_URL = "https://api.singularry.xyz";

export default function WalletSignModal({
  isOpen,
  onClose,
  onSignSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSignSuccess: (token: string) => void;
}) {
  const { publicKey, signMessage } = useWallet();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSign = useCallback(async () => {
    if (!publicKey || !signMessage) return;

    setIsSigningIn(true);
    setError(null);

    try {
      const messageRes = await fetch(
        `${API_BASE_URL}/auth/request_auth_message`,
        {
          method: "POST",
          body: JSON.stringify({
            wallet_address: publicKey.toString(),
            chain_type: "solana",
            chain_id: "mainnet",
          }),
          headers: { "Content-Type": "application/json" },
        },
      );

      if (!messageRes.ok) {
        throw new Error("Failed to request auth message");
      }

      const { message } = await messageRes.json();
      const encodedMessage = new TextEncoder().encode(message);
      const signedMessage = await signMessage(encodedMessage);
      const signature = bs58.encode(signedMessage);

      const tokenRes = await fetch(`${API_BASE_URL}/auth/redeem_auth_message`, {
        method: "POST",
        body: JSON.stringify({
          wallet_address: publicKey.toString(),
          signature: signature,
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (!tokenRes.ok) {
        throw new Error("Failed to redeem signed message");
      }

      const { access_token } = await tokenRes.json();
      onSignSuccess(access_token);
      onClose();
    } catch (e) {
      console.error("Sign error:", e);
      setError("Failed to sign message. Please try again.");
    } finally {
      setIsSigningIn(false);
    }
  }, [publicKey, signMessage, onSignSuccess, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[100]">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-black border border-green-500/30 rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-lg font-medium mb-2">Sign Message to Login</h2>
        <p className="text-green-300/80 text-sm mb-6">
          Please sign the message with your wallet to continue.
        </p>

        {error && (
          <div className="text-red-500 text-sm p-4 bg-red-500/10 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-green-500/30 rounded-lg hover:bg-green-500/10 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSign}
            disabled={isSigningIn || !publicKey}
            className="flex items-center gap-2 px-4 py-2 border border-green-500/30 rounded-lg hover:bg-green-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSigningIn ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing...
              </>
            ) : (
              "Sign Message"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
