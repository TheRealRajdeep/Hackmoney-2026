"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useRef, useState } from "react";
import { DepositModal } from "./DepositModal";
import { WithdrawModal } from "./WithdrawModal";
import { fetchEnsUsernameForAddress } from "./SetUsernameModal";
import { useEnsName, ensNameToUsername } from "@/lib/hooks/useEnsName";
import { usePlatformBalance } from "@/lib/hooks/usePlatformBalance";
import { usePlatformWallet } from "@/lib/hooks/usePlatformWallet";

function truncateAddress(address: string) {
  if (address.length <= 10) return address;
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

export default function Header() {
  const { ready, authenticated, user, login, logout } = usePrivy();
  const { platformAddress, embeddedWalletAddress } = usePlatformWallet();
  const { totalUsdBalance, loading, refetch: refetchBalance } = usePlatformBalance();
  const walletAddress = user?.wallet?.address as string | undefined;
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [usernameDropdownOpen, setUsernameDropdownOpen] = useState(false);
  const usernameDropdownRef = useRef<HTMLDivElement>(null);

  const addressForDisplay = platformAddress ?? walletAddress ?? null;
  const { ensName } = useEnsName(embeddedWalletAddress ?? null);
  const [storedUsername, setStoredUsername] = useState<string | null>(null);

  const addressForEns = embeddedWalletAddress ?? null;

  useEffect(() => {
    if (!addressForEns) {
      setStoredUsername(null);
      return;
    }
    let cancelled = false;
    fetchEnsUsernameForAddress(addressForEns).then((name) => {
      if (!cancelled) setStoredUsername(name);
    });
    return () => {
      cancelled = true;
    };
  }, [addressForEns]);

  useEffect(() => {
    if (!addressForEns) return;
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ address: string }>).detail;
      if (detail?.address === addressForEns.toLowerCase()) {
        fetchEnsUsernameForAddress(addressForEns).then(setStoredUsername);
      }
    };
    window.addEventListener("prophit-ens-registered", handler);
    return () => window.removeEventListener("prophit-ens-registered", handler);
  }, [addressForEns]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (usernameDropdownRef.current && !usernameDropdownRef.current.contains(e.target as Node)) {
        setUsernameDropdownOpen(false);
      }
    };
    if (usernameDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [usernameDropdownOpen]);

  const displayName =
    addressForDisplay == null
      ? null
      : (ensName ? ensNameToUsername(ensName) : null) ??
        storedUsername ??
        truncateAddress(addressForDisplay);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-default bg-bg-surface/95 backdrop-blur-sm">
      <div className="flex h-14 items-center gap-3 px-4 sm:gap-4">
        {/* Logo */}
        <button type="button" className="flex shrink-0 items-center gap-1 rounded p-1 text-white hover:bg-bg-elevated hover:text-accent-cyan transition-colors" aria-label="Home">
          <span className="font-logo text-xl font-semibold tracking-tight">📺 Prophit</span>
        </button>

        {/* Nav */}
        <nav className="hidden items-center gap-1 sm:flex" aria-label="Main">
          <button type="button" className="rounded px-3 py-2 text-sm font-semibold text-white hover:bg-bg-elevated hover:text-accent-cyan transition-colors">
            Following
          </button>
          <button type="button" className="rounded px-3 py-2 text-sm font-semibold text-white hover:bg-bg-elevated hover:text-accent-cyan transition-colors">
            Browse
          </button>
        </nav>

        {/* Search - takes remaining space, leaves room for right block */}
        <div className="relative min-w-0 flex-1 max-w-xl">
          <input
            type="search"
            placeholder="Search"
            className="w-full rounded bg-bg-elevated py-2 pl-10 pr-4 text-sm text-white placeholder-text-muted outline-none ring-1 ring-border-subtle focus:ring-2 focus:ring-accent"
            aria-label="Search"
          />
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" aria-hidden>
            <SearchIcon />
          </span>
        </div>

        {/* Right actions - pushed to corner */}
        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
          <button type="button" className="rounded p-2 text-zinc-400 hover:bg-bg-elevated hover:text-accent-cyan transition-colors" aria-label="Favorites">
            <HeartIcon />
          </button>
          <button type="button" className="rounded p-2 text-zinc-400 hover:bg-bg-elevated hover:text-accent-cyan transition-colors" aria-label="Notifications">
            <BellIcon />
          </button>
          {ready && (
            <>
              {!authenticated ? (
                <button
                  type="button"
                  onClick={login}
                  className="rounded bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-hover transition-colors shadow-lg shadow-accent/20"
                >
                  Connect wallet
                </button>
              ) : (
                <>
                  {addressForDisplay && (
                    <>
                      <div className="relative" ref={usernameDropdownRef}>
                        <button
                          type="button"
                          onClick={() => setUsernameDropdownOpen((o) => !o)}
                          className="rounded bg-bg-elevated px-3 py-1.5 font-mono text-xs text-zinc-300 ring-1 ring-border-subtle hover:bg-bg-card hover:text-accent-cyan transition-colors flex items-center gap-1"
                          title={addressForDisplay}
                        >
                          {displayName}
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform ${usernameDropdownOpen ? "rotate-180" : ""}`}>
                            <path d="m6 9 6 6 6-6" />
                          </svg>
                        </button>
                        {usernameDropdownOpen && (
                          <>
                            <div className="fixed inset-0 z-40" aria-hidden onClick={() => setUsernameDropdownOpen(false)} />
                            <div className="absolute right-0 top-full z-50 mt-1 min-w-[180px] rounded-lg border border-border-default bg-bg-card py-1 shadow-xl">
                              <button
                                type="button"
                                onClick={() => {
                                  setUsernameDropdownOpen(false);
                                  setWithdrawModalOpen(true);
                                }}
                                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-white hover:bg-bg-elevated transition-colors"
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                  <polyline points="7 10 12 15 17 10" />
                                  <line x1="12" y1="15" x2="12" y2="3" />
                                </svg>
                                Withdraw to main wallet
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setDepositModalOpen(true)}
                        className="rounded bg-bg-elevated px-3 py-1.5 text-sm font-medium text-white ring-1 ring-border-subtle hover:bg-bg-card hover:text-accent-cyan transition-colors"
                      >
                        {loading ? "—" : `$${totalUsdBalance}`} <span className="text-text-muted">·</span> Deposit
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={logout}
                    className="rounded border border-border-default px-3 py-2 text-sm font-medium text-zinc-300 hover:bg-bg-elevated hover:text-white transition-colors"
                  >
                    Disconnect
                  </button>
                </>
              )}
            </>
          )}

        </div>
      </div>
      <DepositModal
        open={depositModalOpen}
        onClose={() => {
          setDepositModalOpen(false);
          refetchBalance();
        }}
      />
      <WithdrawModal
        open={withdrawModalOpen}
        onClose={() => {
          setWithdrawModalOpen(false);
          refetchBalance();
        }}
      />
    </header>
  );
}
