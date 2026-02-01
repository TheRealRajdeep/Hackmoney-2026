"use client";

import { PlaceholderCover } from "./PlaceholderCover";

// Placeholder type – replace with real channel type from backend
export type ChannelCardData = {
  id: string;
  title: string;
  channelName: string;
  game: string;
  emoji: string;
  viewers: string;
};

type Props = {
  channel: ChannelCardData;
};

function EyeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function ChannelCard({ channel }: Props) {
  return (
    <article className="group cursor-pointer">
      <div className="relative overflow-hidden rounded-lg">
        {/* Placeholder cover – no mock image; replace with real thumbnail from backend */}
        <PlaceholderCover aspect="video" className="rounded-lg" />
        <span className="absolute left-2 top-2 rounded bg-red-600 px-1.5 py-0.5 text-xs font-semibold uppercase text-white">
          Live
        </span>
        <div className="absolute right-2 top-2 flex items-center gap-1 rounded bg-black/70 px-2 py-1 text-xs text-white">
          <EyeIcon />
          <span>{channel.viewers} viewers</span>
        </div>
      </div>
      <div className="mt-2 flex items-start gap-2">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-zinc-800 text-sm" aria-hidden>
          {channel.emoji}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-white group-hover:text-[#5250a8]">
            {channel.title}
          </h3>
          <p className="truncate text-xs text-zinc-500">{channel.channelName}</p>
          <p className="truncate text-xs text-zinc-500">{channel.game}</p>
        </div>
        <button type="button" className="shrink-0 rounded p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-white" aria-label="More options">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <circle cx="12" cy="6" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="12" cy="18" r="1.5" />
          </svg>
        </button>
      </div>
    </article>
  );
}
