"use client";

function ChevronLeftIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

// Placeholder channel items – replace with real data from backend
const FOLLOWED_CHANNELS = [
  { emoji: "🎮", name: "Channel 1", game: "Category A", viewers: "—" },
  { emoji: "🎯", name: "Channel 2", game: "Category B", viewers: "—" },
  { emoji: "🏆", name: "Channel 3", game: "Category A", viewers: "—" },
  { emoji: "♟️", name: "Channel 4", game: "Category C", viewers: "—" },
  { emoji: "👊", name: "Channel 5", game: "Category B", viewers: "—" },
];

const LIVE_CHANNELS = [
  { emoji: "🎪", name: "Live 1", game: "Category A", viewers: "—" },
  { emoji: "⚡", name: "Live 2", game: "Category B", viewers: "—" },
  { emoji: "🌟", name: "Live 3", game: "Category A", viewers: "—" },
  { emoji: "🔥", name: "Live 4", game: "Category C", viewers: "—" },
  { emoji: "💎", name: "Live 5", game: "Category B", viewers: "—" },
];

export default function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-zinc-800 bg-zinc-950 lg:flex" aria-label="Sidebar">
      <div className="flex flex-col gap-4 overflow-y-auto py-4">
        <div className="px-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">For You</h2>
            <button type="button" className="rounded p-1 text-zinc-500 hover:bg-zinc-800 hover:text-white" aria-label="Collapse">
              <ChevronLeftIcon />
            </button>
          </div>
        </div>

        <div className="px-2">
          <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">Followed Channels</h3>
          <ul className="space-y-0.5" role="list">
            {FOLLOWED_CHANNELS.map((ch, i) => (
              <li key={i}>
                <button
                  type="button"
                  className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-zinc-800"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-base" aria-hidden>
                    {ch.emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-white">{ch.name}</span>
                    <span className="block truncate text-xs text-zinc-500">{ch.game}</span>
                  </div>
                  <span className="shrink-0 text-xs text-zinc-500">{ch.viewers}</span>
                </button>
              </li>
            ))}
          </ul>
          <button type="button" className="mt-1 w-full px-2 py-1.5 text-left text-sm font-medium text-[#3D3B8E] hover:text-[#5250a8]">
            Show More
          </button>
        </div>

        <div className="px-2">
          <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">Live Channels</h3>
          <ul className="space-y-0.5" role="list">
            {LIVE_CHANNELS.map((ch, i) => (
              <li key={i}>
                <button
                  type="button"
                  className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-zinc-800"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-base" aria-hidden>
                    {ch.emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-white">{ch.name}</span>
                    <span className="block truncate text-xs text-zinc-500">{ch.game}</span>
                  </div>
                  <span className="shrink-0 text-xs text-zinc-500">{ch.viewers}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}
