import React from "react";
import { Instagram, Mail, ExternalLink } from "lucide-react";

function SocialLinks() {
  return (
    <div className="flex items-center justify-center gap-6 mt-6 mb-2">
      <a
        href="https://instagram.com/singularryai"
        target="_blank"
        rel="noopener noreferrer"
        className="text-green-400/60 hover:text-green-400 transition-colors"
        title="Instagram"
      >
        <Instagram className="w-5 h-5" />
      </a>
      <a
        href="https://threads.net/singularryai"
        target="_blank"
        rel="noopener noreferrer"
        className="text-green-400/60 hover:text-green-400 transition-colors"
        title="Threads"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.5 12.068V11.5c0-3.247.812-5.956 2.414-8.05C5.606 1.203 8.325 0 12.073 0h.007c3.579.024 6.332 1.205 8.182 3.509 1.645 2.051 2.495 4.905 2.495 8.423v.568c0 3.247-.812 5.956-2.414 8.05-1.692 2.247-4.411 3.45-8.157 3.45Zm-.115-4.781c.824 0 1.484-.17 1.977-.507.477-.329.736-.793.736-1.32 0-.421-.206-.775-.618-1.061-.427-.295-1.013-.443-1.746-.443-.803 0-1.455.17-1.94.507-.477.329-.736.793-.736 1.32 0 .421.206.775.618 1.061.427.295 1.013.443 1.746.443h-.037Zm.092-4.708c1.787 0 3.202-.391 4.208-1.164 1.006-.773 1.519-1.815 1.519-3.089 0-1.253-.513-2.286-1.519-3.059-1.006-.773-2.421-1.164-4.208-1.164-1.787 0-3.202.391-4.208 1.164-1.006.773-1.519 1.815-1.519 3.089 0 1.253.513 2.286 1.519 3.059 1.006.764 2.421 1.164 4.208 1.164Z" />
        </svg>
      </a>
      <a
        href="https://tiktok.com/@singularryai"
        target="_blank"
        rel="noopener noreferrer"
        className="text-green-400/60 hover:text-green-400 transition-colors"
        title="TikTok"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.321 5.562a5.122 5.122 0 0 1-.443-.456 5.548 5.548 0 0 1-1.327-3.184v-.239h-3.762v13.156a2.407 2.407 0 0 1-2.397 2.397 2.407 2.407 0 0 1-2.397-2.397 2.407 2.407 0 0 1 2.397-2.397c.262 0 .516.042.754.12v-3.847a6.021 6.021 0 0 0-.754-.047c-3.367 0-6.118 2.751-6.118 6.118 0 3.367 2.751 6.118 6.118 6.118 3.367 0 6.118-2.751 6.118-6.118v-6.351a9.273 9.273 0 0 0 5.597 1.874v-3.773a5.769 5.769 0 0 1-3.786-.974Z" />
        </svg>
      </a>
      <a
        href="https://www.dextools.io/app/en/solana/pair-explorer/DDSGy3CxioL4QPuj8kiPzxYg37PH4e7hdbD5E1iPmzu3?t=1732798806464"
        target="_blank"
        rel="noopener noreferrer"
        className="text-green-400/60 hover:text-green-400 transition-colors"
        title="DexTools"
      >
        <ExternalLink className="w-5 h-5" />
      </a>

      <a
        href="https://opensea.io/account"
        target="_blank"
        rel="noopener noreferrer"
        className="text-green-400/60 hover:text-green-400 transition-colors"
        title="OpenSea"
      >
        <ExternalLink className="w-5 h-5" />
      </a>
      <a
        href="mailto:creator@singularry.org"
        className="text-green-400/60 hover:text-green-400 transition-colors"
        title="Email"
      >
        <Mail className="w-5 h-5" />
      </a>
    </div>
  );
}

export default SocialLinks;
