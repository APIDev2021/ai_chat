import React from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { checkTokenBalance } from "../utils/wallet";
import WebRTCStreamingAvatar from "./WebRTCStreamingAvatar";
import WalletConnect from "./WalletConnect";

const REQUIRED_TOKEN_AMOUNT = 1;

const ProtectedStreamingComponent = () => {
  const { publicKey } = useWallet();
  const [hasAccess, setHasAccess] = React.useState(false);
  const [isChecking, setIsChecking] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const authCheckRef = React.useRef(false);

  // Check if we have a stored auth token
  React.useEffect(() => {
    if (publicKey) {
      const storedData = localStorage.getItem("wallet_data");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        if (parsedData.publicKey === publicKey.toString()) {
          setIsAuthenticated(true);
        }
      }
    } else {
      setIsAuthenticated(false);
    }
  }, [publicKey]);

  // Only check token balance after authentication is confirmed
  React.useEffect(() => {
    const checkAccess = async () => {
      if (!publicKey || !isAuthenticated || authCheckRef.current) return;

      try {
        setIsChecking(true);
        setError(null);
        authCheckRef.current = true;

        const { hasToken, balance } = await checkTokenBalance(publicKey);
        setHasAccess(hasToken && balance >= REQUIRED_TOKEN_AMOUNT);

        if (!hasToken) {
          setError("You don't have the required token in your wallet.");
        } else if (balance < REQUIRED_TOKEN_AMOUNT) {
          setError(
            `You need at least ${REQUIRED_TOKEN_AMOUNT} tokens to access this feature. Current balance: ${balance}`,
          );
        }
      } catch (err) {
        console.error("Error checking token balance:", err);
        setError("Failed to verify token balance. Please try again.");
        setHasAccess(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkAccess();
  }, [publicKey, isAuthenticated]);

  // Handle successful authentication
  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    authCheckRef.current = false; // Reset the check flag to allow a new balance check
  };

  if (!publicKey) {
    return (
      <div className="border border-green-500/30 rounded-lg bg-black/50 backdrop-blur p-8">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-mono text-green-400">
            Connect Wallet to Access Avatar Stream
          </h2>
          <div className="flex justify-center">
            <WalletConnect onAuthSuccess={handleAuthSuccess} />
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="border border-green-500/30 rounded-lg bg-black/50 backdrop-blur p-8">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-mono text-green-400">
            Please authenticate your wallet
          </h2>
          <div className="flex justify-center">
            <WalletConnect onAuthSuccess={handleAuthSuccess} />
          </div>
        </div>
      </div>
    );
  }

  if (isChecking) {
    return (
      <div className="border border-green-500/30 rounded-lg bg-black/50 backdrop-blur p-8">
        <div className="text-center">
          <p className="text-green-400">Checking token balance...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-green-500/30 rounded-lg bg-black/50 backdrop-blur p-8">
        <div className="text-center space-y-4">
          <p className="text-red-400">{error}</p>
          <WalletConnect onAuthSuccess={handleAuthSuccess} />
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="border border-green-500/30 rounded-lg bg-black/50 backdrop-blur p-8">
        <div className="text-center space-y-4">
          <p className="text-red-400">
            Access denied. Insufficient token balance.
          </p>
          <WalletConnect onAuthSuccess={handleAuthSuccess} />
        </div>
      </div>
    );
  }

  return <WebRTCStreamingAvatar />;
};

export default ProtectedStreamingComponent;
