import React from 'react';
import { Share2, CheckCircle2, AlertCircle, ShieldCheck, ExternalLink, RefreshCw } from 'lucide-react';
import { ConnectedAccount, PlatformId } from '../../types';
import { PLATFORMS_CONFIG } from '../../config/platforms';

interface ConnectedAccountsViewProps {
  accounts: ConnectedAccount[];
  onToggleConnect: (platform: PlatformId) => void;
  onNotify: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const ConnectedAccountsView: React.FC<ConnectedAccountsViewProps> = ({
  accounts,
  onToggleConnect,
  onNotify,
}) => {
  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="border-b border-[#381B1E] pb-4">
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#FFF8F0] tracking-tight flex items-center gap-2.5">
          <Share2 className="w-5 h-5 text-[#E0A96D]" />
          <span>Connected Social Accounts & Gateways</span>
        </h1>
        <p className="text-xs text-[#D4A373] mt-0.5">
          Manage OAuth authorization tokens for direct publishing and preview verification.
        </p>
      </div>

      {/* Security notice */}
      <div className="p-4 rounded-2xl bg-[#1C0E10]/95 border border-[#381B1E] flex items-start gap-3 text-xs text-[#D4A373]">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-[#FFF8F0]">OAuth 2.0 Token Isolation</p>
          <p className="text-[#D4A373] leading-relaxed">
            OmniPost AI never requests or stores account passwords. Integrations use scoped refresh tokens with restricted publishing privileges.
          </p>
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {accounts.map((acc) => {
          const cfg = PLATFORMS_CONFIG[acc.platform];
          return (
            <div
              key={acc.platform}
              className="p-5 rounded-2xl bg-[#1C0E10]/95 border border-[#381B1E] flex flex-col justify-between space-y-4 hover:border-[#8B1E2D]/60 transition-all shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm shadow-md"
                    style={{ backgroundColor: cfg?.brandColor || '#8B1E2D' }}
                  >
                    {cfg?.shortName}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#FFF8F0] flex items-center gap-1.5">
                      {cfg?.name}
                      {acc.connected ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5 text-[#A87B51]" />
                      )}
                    </h3>
                    <p className="text-xs text-[#D4A373]">
                      {acc.connected ? (acc.handle || acc.username || 'Authorized') : 'Not Connected'}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase tracking-wider ${
                    acc.connected
                      ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                      : 'bg-[#251214] text-[#A87B51] border border-[#381B1E]'
                  }`}
                >
                  {acc.connected ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* Scopes */}
              <div className="space-y-1.5 pt-1">
                <p className="text-[11px] font-medium text-[#D4A373]">Authorized Scopes:</p>
                <div className="flex flex-wrap gap-1">
                  {acc.scopes.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-[#14090A] border border-[#381B1E] text-[10px] font-mono text-[#D4A373]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-[#381B1E] flex items-center justify-between text-xs">
                <span className="text-[11px] text-[#A87B51]">
                  {acc.connectedAt ? `Connected: ${acc.connectedAt}` : 'Ready for OAuth setup'}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    onToggleConnect(acc.platform);
                    if (acc.connected) {
                      onNotify('info', `${cfg?.name} Disconnected`, 'Tokens revoked from session.');
                    } else {
                      onNotify('success', `${cfg?.name} Connected!`, 'OAuth handshake simulated with read/write scopes.');
                    }
                  }}
                  className={`px-3.5 py-1.5 rounded-xl font-semibold text-xs transition-colors ${
                    acc.connected
                      ? 'bg-[#251214] text-rose-300 hover:bg-rose-950/40 border border-rose-500/30'
                      : 'bg-gradient-to-r from-[#8B1E2D] to-[#A62639] hover:from-[#A62639] hover:to-[#C93B51] text-white shadow-md shadow-[#8B1E2D]/25'
                  }`}
                >
                  {acc.connected ? 'Disconnect' : 'Connect Platform'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
