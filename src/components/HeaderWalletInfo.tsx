import { FC } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

const HeaderWalletInfo: FC = () => {
  const { publicKey, disconnect } = useWallet();

  if (!publicKey) return null;

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-green-400">
        {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
      </span>
      <button
        onClick={() => {
          disconnect();
          localStorage.removeItem("wallet_data");
        }}
        className="text-sm text-green-400 hover:text-green-300 transition-colors"
      >
        Disconnect
      </button>
    </div>
  );
};

export default HeaderWalletInfo;
