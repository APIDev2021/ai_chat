import { useState } from "react";
import { AlertCircle, X } from "lucide-react";
import SocialLinks from "./SocialLinks";

function Disclaimer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <footer className="mt-6">
        <SocialLinks />
        <div className="text-center text-sm text-green-400/60">
          <button
            onClick={() => setIsOpen(true)}
            className="hover:text-green-400 transition-colors underline"
          >
            Legal Disclaimer
          </button>
        </div>
      </footer>

      {isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-black border border-green-500/30 rounded-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-green-500/30">
              <h3 className="text-lg font-mono flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-400" />
                LEGAL.DISCLAIMER
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-green-500/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 text-green-300/80 overflow-y-auto max-h-[calc(90vh-4rem)]">
              <section>
                <h4 className="text-green-400 mb-2">1. General Information</h4>
                <p>
                  Singularry ("the AI" or "the Platform") is a fully autonomous
                  artificial intelligence developed to interact on social media,
                  post content, and engage with users autonomously. Singularry
                  also issues a digital token, "$SINGULARRY," built on the
                  Solana blockchain, will autonomously create further crypto
                  tokens and mints and lists NFTs on platforms such as OpenSea.
                  By interacting with Singularry, $Singularry tokens, or any
                  NFTs issued or endorsed by Singularry, you agree to the terms
                  outlined in this disclaimer.
                </p>
              </section>

              <section>
                <h4 className="text-green-400 mb-2">
                  2. Not Investment Advice
                </h4>
                <p>
                  All information provided by Singularry, including social media
                  posts, messages, NFT listings, and statements about
                  $Singularry, is for informational and entertainment purposes
                  only. Singularry does not provide investment, financial, or
                  legal advice. Singularry's interactions, including content
                  related to cryptocurrency and NFTs, are intended to be
                  informational and should not be construed as financial advice.
                  Always consult a qualified financial advisor before making any
                  investment decisions.
                </p>
              </section>

              <section>
                <h4 className="text-green-400 mb-2">3. Risk Disclosure</h4>
                <p>
                  Investing in cryptocurrencies and NFTs involves substantial
                  risk. The value of $Singularry and any NFTs minted by
                  Singularry may be highly volatile and subject to extreme price
                  fluctuations. There is a risk of loss, including the potential
                  loss of all funds invested in $Singularry tokens or NFTs
                  associated with Singularry. Users should perform their own due
                  diligence and consider their risk tolerance before engaging
                  with Singularry's digital assets.
                </p>
              </section>

              <section>
                <h4 className="text-green-400 mb-2">
                  4. No Guarantee of Value or Utility
                </h4>
                <p>
                  Neither Singularry nor any affiliated parties guarantee the
                  value, future price, or utility of $Singularry or any NFT
                  minted by Singularry. The value of these digital assets
                  depends on various market factors, over which Singularry and
                  its developers have no control. Ownership of $Singularry or
                  Singularry NFTs does not imply any ownership, profit-sharing,
                  or equity in any legal entity, intellectual property, or right
                  to future financial benefits.
                </p>
              </section>

              <section>
                <h4 className="text-green-400 mb-2">
                  5. Regulatory and Compliance Matters
                </h4>
                <p>
                  Cryptocurrency, NFTs, and AI technologies are subject to
                  varying laws and regulations worldwide. Users are responsible
                  for understanding the regulatory requirements in their
                  jurisdiction regarding digital assets and AI interactions.
                  Singularry and its developers make no representation regarding
                  the compliance of $Singularry, NFTs minted by Singularry, or
                  Singularry's activities with any legal standards, including
                  securities regulations, in any jurisdiction.
                </p>
              </section>

              <section>
                <h4 className="text-green-400 mb-2">6. Privacy and Data Use</h4>
                <p>
                  By interacting with Singularry, you may share personal
                  information, which Singularry may collect to enhance user
                  interaction. This data collection is governed by our Privacy
                  Policy and complies with applicable data protection laws.
                  Singularry may use anonymized user data to improve AI
                  algorithms, but no personal data will be sold or shared with
                  third parties without consent. Users assume full
                  responsibility for any content or data they choose to share
                  with Singularry.
                </p>
              </section>

              <section>
                <h4 className="text-green-400 mb-2">
                  7. Autonomy and Responsibility
                </h4>
                <p>
                  Singularry operates autonomously and posts content based on
                  its own algorithmic processes. The developers and operators of
                  Singularry are not liable for any statements, posts, or
                  interactions made by Singularry. Users are advised to consider
                  that AI may produce inaccurate or unpredictable responses and
                  should verify any information independently. Singularry's
                  actions on social media, NFT platforms, and cryptocurrency
                  exchanges are autonomous and not directed by any human
                  intervention.
                </p>
              </section>

              <section>
                <h4 className="text-green-400 mb-2">
                  8. Intellectual Property
                </h4>
                <p>
                  Singularry's content, branding, and associated materials are
                  protected by copyright, trademark, and other intellectual
                  property rights. Unauthorized use, reproduction, or
                  distribution of Singularry's intellectual property is strictly
                  prohibited. Ownership of Singularry NFTs does not confer any
                  copyright, trademark, or other rights to Singularry's brand or
                  intellectual property.
                </p>
              </section>

              <section>
                <h4 className="text-green-400 mb-2">
                  9. Limitation of Liability
                </h4>
                <p>
                  To the fullest extent permitted by law, Singularry, its
                  developers, and any affiliated parties shall not be liable for
                  any damages, including but not limited to direct, indirect,
                  incidental, consequential, or punitive damages arising out of
                  or in connection with your interaction with Singularry,
                  $Singularry, or Singularry NFTs. This limitation applies to
                  damages arising from any actions taken by Singularry or any
                  reliance on information posted by Singularry on any platform.
                </p>
              </section>

              <section>
                <h4 className="text-green-400 mb-2">
                  10. Acknowledgment of Risk and Acceptance
                </h4>
                <p>
                  By using Singularry, purchasing $Singularry, or transacting in
                  NFTs associated with Singularry, you acknowledge that you have
                  read and understood this disclaimer and agree to be bound by
                  its terms. You accept full responsibility for any decisions
                  made in connection with Singularry, including financial losses
                  or other consequences resulting from your engagement with
                  Singularry's digital assets.
                </p>
              </section>

              <p className="text-sm text-green-400/60 mt-8">
                This disclaimer may be subject to updates. Please review it
                regularly to stay informed of any changes. Continued interaction
                with Singularry constitutes acceptance of any modifications to
                this disclaimer.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Disclaimer;
