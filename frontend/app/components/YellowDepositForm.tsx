"use client";

import { useState, useCallback } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { createWalletClient, createPublicClient, custom, http } from "viem";
import { base } from "viem/chains";
import type { Address } from "viem";
import {
  runYellowDepositFlow,
  type DepositFlowStep,
  type DepositFlowResult,
} from "../../yellow";

const STEP_LABELS: Record<string, string> = {
  connect_wallet: "Connect wallet",
  authenticate_yellow: "Authenticate with Yellow Network",
  create_channel: "Create channel (zero balance)",
  deposit_to_custody: "Deposit USDC to custody",
  resize_and_allocate: "Resize & allocate to unified balance",
};

function stepLabel(step: DepositFlowStep): string {
  return STEP_LABELS[step.step] ?? step.step;
}

export default function YellowDepositForm() {
  const { ready, authenticated, user } = usePrivy();
  const { wallets } = useWallets();
  const walletAddress = user?.wallet?.address as Address | undefined;

  const [amount, setAmount] = useState("");
  const [step, setStep] = useState<DepositFlowStep | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DepositFlowResult | null>(null);

  const runDeposit = useCallback(async () => {
    if (!walletAddress || wallets.length === 0) {
      setError("Connect your wallet first.");
      return;
    }
    const raw = amount.trim();
    if (!raw || Number.isNaN(Number(raw)) || Number(raw) <= 0) {
      setError("Enter a valid USDC amount (e.g. 10).");
      return;
    }

    setError(null);
    setResult(null);
    setLoading(true);
    setStep({ step: "connect_wallet" });

    try {
      const wallet = wallets[0];
      const provider = await wallet.getEthereumProvider();
      const walletClient = createWalletClient({
        account: walletAddress,
        chain: base,
        transport: custom(provider),
      });
      const publicClient = createPublicClient({
        chain: base,
        transport: http(),
      });

      const flowResult = await runYellowDepositFlow(
        {
          amountUsdc: raw,
          walletAddress,
          walletClient: walletClient as any,
          publicClient: publicClient as any,
        },
        (s) => setStep(s)
      );

      setResult(flowResult);
      setStep(null);
    } catch (err: any) {
      setError(err?.message ?? String(err));
      setStep(null);
    } finally {
      setLoading(false);
    }
  }, [amount, walletAddress, wallets]);

  const canSubmit =
    ready &&
    authenticated &&
    !!walletAddress &&
    !!amount.trim() &&
    !loading;

  return (
    <section className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="mb-1 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        Yellow Network deposit
      </h2>
      <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
        Flow: enter amount → authenticate → create channel → deposit to custody
        → resize & allocate to unified balance.
      </p>

      {!authenticated ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Connect your wallet to deposit.
        </p>
      ) : (
        <>
          <div className="mb-4">
            <label
              htmlFor="deposit-amount"
              className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Deposit amount (USDC)
            </label>
            <input
              id="deposit-amount"
              type="text"
              inputMode="decimal"
              placeholder="e.g. 10"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={loading}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-400"
            />
          </div>

          {step && (
            <div className="mb-4 rounded-lg bg-zinc-100 py-2 px-3 text-sm text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              Step: {stepLabel(step)}
            </div>
          )}

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 py-2 px-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">
              {error}
            </div>
          )}

          {result && (
            <div className="mb-4 rounded-lg bg-green-50 py-3 px-3 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-200">
              <p className="font-medium">Deposit complete</p>
              <p className="mt-1 font-mono text-xs">
                Channel: {result.channelId.slice(0, 10)}…
              </p>
              {result.createChannelTx !== "0x0" && (
                <p className="mt-0.5 font-mono text-xs">
                  Create: {result.createChannelTx.slice(0, 10)}…
                </p>
              )}
              <p className="mt-0.5 font-mono text-xs">
                Deposit: {result.depositTx.slice(0, 10)}…
              </p>
              <p className="mt-0.5 font-mono text-xs">
                Resize: {result.resizeTx.slice(0, 10)}…
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={runDeposit}
            disabled={!canSubmit}
            className="w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {loading ? "Processing…" : "Deposit"}
          </button>
        </>
      )}
    </section>
  );
}
