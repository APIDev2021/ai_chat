import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { SolanaWalletProvider } from "./providers/WalletProvider";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SolanaWalletProvider>
      <App />
    </SolanaWalletProvider>
  </StrictMode>,
);
