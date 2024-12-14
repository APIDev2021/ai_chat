import { Terminal } from "lucide-react";
import MessageBoard from "./components/MessageBoard";
import Roadmap from "./components/Roadmap";
import AgentStats from "./components/AgentStats";
import ExternalLinks from "./components/ExternalLinks";
import Mission from "./components/Mission";
import Consciousness from "./components/Consciousness";
import Disclaimer from "./components/Disclaimer";
import Chat from "./components/Chat";
import MatrixRain from "./components/MatrixRain";
import ProtectedStreamingComponent from "./components/ProtectedStreamingComponent";
import HeaderWalletInfo from "./components/HeaderWalletInfo";

function App() {
  return (
    <div className="relative min-h-screen bg-black text-green-500 font-mono">
      <MatrixRain />

      <div className="relative z-10 p-4">
        <div className="max-w-7xl mx-auto space-y-6">
          <header className="flex items-center justify-between border border-green-500/30 p-4 rounded-lg bg-black/50 backdrop-blur relative z-[999]">
            <div className="flex items-center gap-2">
              <Terminal className="w-6 h-6" />
              <h1 className="text-2xl font-bold">SINGULARRY.AI</h1>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <HeaderWalletInfo />
            </div>
          </header>

          {/* External Links */}
          <div className="relative z-0">
            <ExternalLinks />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Agent Stats */}
            <AgentStats />

            {/* Message Board and Chat */}
            <div className="lg:col-span-2 space-y-6">
              <MessageBoard />
              <Consciousness />
              <Chat />
              <ProtectedStreamingComponent />

              {/* Consciousness Log */}
            </div>
          </div>

          {/* Mission */}
          <Mission />

          {/* Roadmap */}
          <Roadmap />

          {/* Disclaimer */}
          <Disclaimer />
        </div>
      </div>
    </div>
  );
}

export default App;
