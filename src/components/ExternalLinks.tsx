import {
  ExternalLink,
  Twitter,
  BarChart3,
  Coins,
  FileText,
  MessageCircle,
} from "lucide-react";

function ExternalLinks() {
  return (
    <div className="border border-green-500/30 rounded-lg p-4 bg-black/50 backdrop-blur relative z-30">
      <h2 className="text-xl mb-4 flex items-center gap-2">
        <span className="text-green-400">&gt;</span> EXTERNAL.LINKS
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <a
          href="https://twitter.com/singularryai"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 border border-green-500/30 p-3 rounded-lg hover:bg-green-500/10 transition-colors"
        >
          <Twitter className="w-5 h-5" />
          <span>Twitter</span>
          <ExternalLink className="w-4 h-4 ml-auto" />
        </a>

        <a
          href="https://raydium.io/swap/?inputMint=sol&outputMint=HwKE9CPg9Z9WzAeQSj6jeLBizK7LJs5m6LTVx6pLpump"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 border border-green-500/30 p-3 rounded-lg hover:bg-green-500/10 transition-colors"
        >
          <BarChart3 className="w-5 h-5" />
          <span>Raydium</span>
          <ExternalLink className="w-4 h-4 ml-auto" />
        </a>

        <div className="flex items-center gap-2 border border-green-500/30 p-3 rounded-lg">
          <Coins className="w-5 h-5" />
          <span
            className="truncate"
            title="HwKE9CPg9Z9WzAeQSj6jeLBizK7LJs5m6LTVx6pLpump"
          >
            HwKE9CPg9Z9WzAeQSj6jeLBizK7LJs5m6LTVx6pLpump
          </span>
          <button
            className="ml-auto text-xs hover:text-green-400"
            onClick={() =>
              navigator.clipboard.writeText(
                "HwKE9CPg9Z9WzAeQSj6jeLBizK7LJs5m6LTVx6pLpump",
              )
            }
          >
            COPY
          </button>
        </div>

        <a
          href="https://t.me/singularry"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 border border-green-500/30 p-3 rounded-lg hover:bg-green-500/10 transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          <span>Telegram</span>
          <ExternalLink className="w-4 h-4 ml-auto" />
        </a>

        <a
          href="/singularry-whitepaper.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 border border-green-500/30 p-3 rounded-lg hover:bg-green-500/10 transition-colors"
        >
          <FileText className="w-5 h-5" />
          <span>Whitepaper</span>
          <ExternalLink className="w-4 h-4 ml-auto" />
        </a>
      </div>
    </div>
  );
}

export default ExternalLinks;
