import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { PlaceholderCover } from "./components/PlaceholderCover";
import { ChannelCard } from "./components/ChannelCard";
import type { ChannelCardData } from "./components/ChannelCard";

// Placeholder data – replace with real data from backend
const FEATURED = {
  title: "Featured stream",
  channelName: "Channel name",
  game: "Category",
  emoji: "🎮",
  viewers: "0",
  language: "English",
  region: "—",
};

const RECOMMENDED_CHANNELS: ChannelCardData[] = [
  { id: "1", title: "Stream title 1", channelName: "Channel 1", game: "Category A", emoji: "🎮", viewers: "—" },
  { id: "2", title: "Stream title 2", channelName: "Channel 2", game: "Category B", emoji: "⚡", viewers: "—" },
  { id: "3", title: "Stream title 3", channelName: "Channel 3", game: "Category A", emoji: "🎪", viewers: "—" },
  { id: "4", title: "Stream title 4", channelName: "Channel 4", game: "Category C", emoji: "🌟", viewers: "—" },
  { id: "5", title: "Stream title 5", channelName: "Channel 5", game: "Category B", emoji: "🔥", viewers: "—" },
  { id: "6", title: "Stream title 6", channelName: "Channel 6", game: "Category A", emoji: "💎", viewers: "—" },
];

function EyeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-zinc-950 font-sans text-zinc-100">
      <Header />
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <Sidebar />
        <main className="min-h-0 flex-1 overflow-auto">
          <div className="mx-auto max-w-6xl px-4 py-6">
            {/* Top row: back + For You */}
            <div className="mb-4 flex items-center gap-2">
              <button type="button" className="rounded p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white" aria-label="Back">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
              <h1 className="text-xl font-bold text-white">For You</h1>
            </div>

            {/* Featured stream – placeholder cover only */}
            <section className="mb-8" aria-label="Featured stream">
              <div className="relative mx-auto w-full max-w-[50%] overflow-hidden rounded-lg">
                <PlaceholderCover aspect="video" className="rounded-lg" />
                <span className="absolute left-4 top-4 rounded bg-red-600 px-2 py-1 text-xs font-semibold uppercase text-white">
                  Live
                </span>
                <div className="absolute right-4 top-4 flex items-center gap-2 rounded bg-black/70 px-3 py-1.5 text-sm text-white">
                  <EyeIcon />
                  <span>{FEATURED.viewers} viewers</span>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-zinc-800 text-lg" aria-hidden>
                    {FEATURED.emoji}
                  </span>
                  <div>
                    <h2 className="text-lg font-semibold text-white">{FEATURED.title}</h2>
                    <p className="text-sm text-zinc-500">{FEATURED.channelName}</p>
                    <p className="text-sm text-zinc-500">{FEATURED.game}</p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {FEATURED.language} · {FEATURED.region}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" className="rounded p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white" aria-label="Volume">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                    </svg>
                  </button>
                  <button type="button" className="rounded p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white" aria-label="Settings">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                      <circle cx="12" cy="12" r="3" />
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                    </svg>
                  </button>
                  <button type="button" className="rounded bg-zinc-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-600">
                    Quality
                  </button>
                  <button type="button" className="rounded bg-zinc-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-600">
                    Clip
                  </button>
                </div>
              </div>
            </section>

            {/* Live channels we think you'll like */}
            <section aria-labelledby="recommended-heading">
              <h2 id="recommended-heading" className="mb-4 text-xl font-bold text-white">
                Live channels we think you&apos;ll like
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {RECOMMENDED_CHANNELS.map((channel) => (
                  <ChannelCard key={channel.id} channel={channel} />
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
