"use client";

import { usePrivy } from "@privy-io/react-auth";

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
  const walletAddress = user?.wallet?.address;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950">
      <div className="flex h-14 items-center gap-3 px-4 sm:gap-4">
        {/* Logo */}
        <button type="button" className="flex shrink-0 items-center gap-1 rounded p-1 text-white hover:bg-zinc-800" aria-label="Home">
          <span className="text-xl font-bold tracking-tight">Yellow</span>
        </button>

        {/* Nav */}
        <nav className="hidden items-center gap-1 sm:flex" aria-label="Main">
          <button type="button" className="rounded px-3 py-2 text-sm font-semibold text-white hover:bg-zinc-800">
            Following
          </button>
          <button type="button" className="rounded px-3 py-2 text-sm font-semibold text-white hover:bg-zinc-800">
            Browse
          </button>
        </nav>

        {/* Search - takes remaining space, leaves room for right block */}
        <div className="relative min-w-0 flex-1 max-w-xl">
          <input
            type="search"
            placeholder="Search"
            className="w-full rounded bg-zinc-900 py-2 pl-10 pr-4 text-sm text-white placeholder-zinc-500 outline-none ring-1 ring-zinc-800 focus:ring-2 focus:ring-[#3D3B8E]"
            aria-label="Search"
          />
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" aria-hidden>
            <SearchIcon />
          </span>
        </div>

        {/* Right actions - pushed to corner */}
        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
          <button type="button" className="rounded p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white" aria-label="Favorites">
            <HeartIcon />
          </button>
          <button type="button" className="rounded p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white" aria-label="Notifications">
            <BellIcon />
          </button>
          {ready && (
            <>
              {!authenticated ? (
                <button
                  type="button"
                  onClick={login}
                  className="rounded bg-[#3D3B8E] px-4 py-2 text-sm font-semibold text-white hover:bg-[#5250a8]"
                >
                  Connect wallet
                </button>
              ) : (
                <>
                  {walletAddress && (
                    <span
                      className="rounded bg-zinc-800 px-3 py-1.5 font-mono text-xs text-zinc-300"
                      title={walletAddress}
                    >
                      {truncateAddress(walletAddress)}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={logout}
                    className="rounded border border-zinc-700 px-3 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-800"
                  >
                    Disconnect
                  </button>
                </>
              )}
            </>
          )}

        </div>
      </div>
    </header>
  );
}
