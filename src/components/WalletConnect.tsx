import { FC, useState, useEffect } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { getCachedTokenBalance } from "../utils/wallet";
import WalletSignModal from "./WalletSignModal";

interface StoredWalletData {
  token: string;
  publicKey: string;
}

interface WalletConnectProps {
  onAuthSuccess?: () => void;
}

const WalletConnect: FC<WalletConnectProps> = ({ onAuthSuccess }) => {
  const { publicKey, disconnect, connected } = useWallet();
  const [isSignModalOpen, setIsSignModalOpen] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [tokenBalance, setTokenBalance] = useState({
    hasToken: false,
    balance: 0,
  });

  useEffect(() => {
    if (!isSignModalOpen) return;

    const style = document.createElement("style");
    style.textContent = `
      .wallet-adapter-button {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
    return () => style.remove();
  }, [isSignModalOpen]);

  useEffect(() => {
    if (connected && publicKey) {
      const storedData = localStorage.getItem("wallet_data");
      if (storedData) {
        const parsedData: StoredWalletData = JSON.parse(storedData);
        if (parsedData.publicKey === publicKey.toString()) {
          setToken(parsedData.token);
          onAuthSuccess?.();
        } else {
          setIsSignModalOpen(true);
          localStorage.removeItem("wallet_data");
        }
      } else {
        setIsSignModalOpen(true);
      }
    }
  }, [connected, publicKey, onAuthSuccess]);

  useEffect(() => {
    const checkBalance = async () => {
      if (publicKey && token) {
        try {
          const balance = await getCachedTokenBalance(publicKey);
          setTokenBalance(balance);
        } catch (error) {
          console.error("Failed to check token balance:", error);
        }
      }
    };
    checkBalance();
  }, [publicKey, token]);

  const handleSignSuccess = (accessToken: string) => {
    if (!publicKey) return;
    const walletData: StoredWalletData = {
      token: accessToken,
      publicKey: publicKey.toString(),
    };
    setToken(accessToken);
    localStorage.setItem("wallet_data", JSON.stringify(walletData));
    onAuthSuccess?.();
  };

  const handleDisconnect = () => {
    setIsSignModalOpen(false);
    disconnect();
    setToken(null);
    setTokenBalance({ hasToken: false, balance: 0 });
    localStorage.removeItem("wallet_data");
  };

  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <WalletMultiButton className="!bg-transparent !h-9 !text-sm !font-normal !border !border-green-500/30 !rounded-lg !py-2 !px-4 hover:!bg-green-500/10 !transition-colors !text-green-500" />
      </div>
      {publicKey && (
        <>
          {tokenBalance.hasToken && (
            <span className="text-sm text-green-400">
              Balance: {tokenBalance.balance}
            </span>
          )}
          <button
            onClick={handleDisconnect}
            className="flex items-center gap-1 text-sm text-green-400 hover:text-green-300"
          >
            Disconnect
          </button>
        </>
      )}
      <WalletSignModal
        isOpen={isSignModalOpen}
        onClose={() => setIsSignModalOpen(false)}
        onSignSuccess={handleSignSuccess}
      />
    </div>
  );
};

export default WalletConnect;
