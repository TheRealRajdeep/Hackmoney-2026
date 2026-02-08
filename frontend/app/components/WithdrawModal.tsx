"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createWalletClient, custom, parseUnits, type Address, type WalletClient } from "viem";
import { baseSepolia } from "viem/chains";
import { useWallets } from "@privy-io/react-auth";
import { usePlatformBalance } from "@/lib/hooks/usePlatformBalance";
import { usePlatformWallet } from "@/lib/hooks/usePlatformWallet";
import { USDC_BASE_SEPOLIA } from "@/lib/constants";

const ERC20_TRANSFER_ABI = [
  {
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

interface WithdrawModalProps {
  open: boolean;
  onClose: () => void;
}

export function WithdrawModal({ open, onClose }: WithdrawModalProps) {
  const { metamaskAddress, mainAddress, platformAddress, ensurePlatformWallet } = usePlatformWallet();
  const { usdcBalance, loading, refetch } = usePlatformBalance();
  const { wallets } = useWallets();
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Determine withdraw destination: use external wallet ( metamask or main if different from platform)
  const toAddress = (() => {
    const platform = platformAddress?.toLowerCase();
    const main = mainAddress?.toLowerCase();
    const meta = metamaskAddress?.toLowerCase();
    if (meta && meta !== platform) return metamaskAddress as Address;
    if (main && main !== platform) return mainAddress as Address;
    return null;
  })();

  const createWalletClientFromTarget = useCallback(
    async (
      target: { getEthereumProvider?: () => Promise<unknown>; address?: string; switchChain?: (chainId: number) => Promise<void> } | undefined
    ): Promise<WalletClient | null> => {
      if (!target || typeof target.getEthereumProvider !== "function") return null;
      if (typeof target.switchChain === "function") {
        await target.switchChain(baseSepolia.id);
      }
      const provider = await target.getEthereumProvider();
      if (!provider) return null;
      const address = target.address as Address | undefined;
      if (!address) return null;
      const rawProvider = provider as { request(...args: unknown[]): Promise<unknown> };
      const wrappedProvider = {
        request: async (args: { method: string; params?: unknown[] }) => {
          if (args.method === "wallet_sendTransaction" && args.params?.[0]) {
            return rawProvider.request({
              method: "eth_sendTransaction",
              params: [args.params[0]],
            });
          }
          return rawProvider.request(args);
        },
      };
      return createWalletClient({
        transport: custom(wrappedProvider),
        chain: baseSepolia,
        account: address,
      });
    },
    []
  );

  const getEmbeddedWalletClient = useCallback(async (): Promise<WalletClient | null> => {
    if (!platformAddress) return null;
    await ensurePlatformWallet();
    const list = wallets ?? [];
    const embedded = (list as { address?: string; walletClientType?: string; getEthereumProvider?: () => Promise<unknown>; switchChain?: (chainId: number) => Promise<void> }[]).find(
      (x) =>
        x?.address?.toLowerCase() === platformAddress.toLowerCase() &&
        (x?.walletClientType === "privy" || x?.walletClientType === "privy-v2")
    );
    if (!embedded) {
      const fallback = (list as { address?: string; getEthereumProvider?: () => Promise<unknown>; switchChain?: (chainId: number) => Promise<void> }[]).find(
        (x) => x?.address?.toLowerCase() === platformAddress.toLowerCase()
      );
      if (!fallback || typeof fallback.getEthereumProvider !== "function") return null;
      return createWalletClientFromTarget(fallback);
    }
    return createWalletClientFromTarget(embedded);
  }, [wallets, platformAddress, ensurePlatformWallet, createWalletClientFromTarget]);

  const handleWithdraw = useCallback(async () => {
    if (!toAddress || !amount || !platformAddress) return;
    setError(null);
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      setError("Enter a valid amount");
      return;
    }
    const usdcBalanceNum = parseFloat(usdcBalance);
    if (num > usdcBalanceNum) {
      setError(`Insufficient balance. You have $${usdcBalance} USDC.`);
      return;
    }
    setSubmitting(true);
    try {
      const walletClient = await getEmbeddedWalletClient();
      if (!walletClient?.account) {
        setError("Could not connect to your platform wallet. Try again.");
        setSubmitting(false);
        return;
      }
      const amountWei = parseUnits(amount, 6);
      const hash = await walletClient.writeContract({
        address: USDC_BASE_SEPOLIA,
        abi: ERC20_TRANSFER_ABI,
        functionName: "transfer",
        args: [toAddress, amountWei],
        account: walletClient.account,
      });
      setSuccess(true);
      setAmount("");
      refetch();
      // Reset success state after a moment
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || "Withdrawal failed. Try again.");
    } finally {
      setSubmitting(false);
    }
  }, [toAddress, amount, platformAddress, usdcBalance, getEmbeddedWalletClient, refetch]);

  const handleClose = useCallback(() => {
    setAmount("");
    setError(null);
    setSuccess(false);
    refetch();
    onClose();
  }, [onClose, refetch]);

  useEffect(() => {
    if (open) {
      ensurePlatformWallet();
    }
  }, [open, ensurePlatformWallet]);

  if (!open) return null;

  const displayBalance = loading ? "—" : usdcBalance;

  return (
    <div className="fixed inset-0 z-[100] flex min-h-screen items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="withdraw-modal-title">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} aria-hidden />
      <div className="relative mx-auto w-full max-w-md rounded-xl border border-border-default bg-bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border-default px-4 py-3">
          <h2 id="withdraw-modal-title" className="text-lg font-semibold text-white">
            Withdraw to main wallet
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="rounded p-1.5 text-zinc-400 hover:bg-bg-elevated hover:text-white transition-colors"
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="px-4 py-4">
          {!toAddress ? (
            <p className="text-sm text-text-muted">
              Link an external wallet (MetaMask, Coinbase Wallet, etc.) to withdraw funds from your Prophit balance to it.
            </p>
          ) : (
            <>
              <p className="mb-3 text-sm text-text-muted">
                USDC Balance: <span className="font-semibold text-white">${displayBalance}</span>
              </p>
              <div className="mb-3">
                <label htmlFor="withdraw-amount" className="mb-1 block text-xs text-text-muted">
                  Amount (USDC)
                </label>
                <div className="flex gap-2">
                  <input
                    id="withdraw-amount"
                    type="text"
                    inputMode="decimal"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                    className="flex-1 rounded-lg border border-border-default bg-bg-elevated px-3 py-2.5 text-sm text-white placeholder-text-muted outline-none ring-1 ring-border-subtle focus:ring-2 focus:ring-accent"
                  />
                  <button
                    type="button"
                    onClick={() => setAmount(usdcBalance)}
                    className="rounded-lg border border-border-default bg-bg-elevated px-3 py-2.5 text-sm font-medium text-accent-cyan hover:bg-bg-card transition-colors"
                  >
                    Max
                  </button>
                </div>
              </div>
              {error && (
                <p className="mb-3 text-sm text-red-400">{error}</p>
              )}
              {success && (
                <p className="mb-3 text-sm text-emerald-400">Withdrawal successful!</p>
              )}
              <button
                type="button"
                onClick={handleWithdraw}
                disabled={submitting || !amount || parseFloat(amount) <= 0}
                className="w-full rounded-lg bg-brand py-2.5 text-sm font-semibold text-white hover:bg-brand-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? "Withdrawing…" : "Withdraw"}
              </button>
              <p className="mt-3 text-xs text-text-muted">
                Withdraws USDC from your Prophit balance to your connected main wallet on Base Sepolia.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
