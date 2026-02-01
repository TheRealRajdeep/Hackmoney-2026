"use client";

/** Placeholder cover for thumbnails – no mock images. Replace with real data from backend. */
export function PlaceholderCover({ aspect = "video", className = "" }: { aspect?: "video" | "square"; className?: string }) {
  const aspectClass = aspect === "video" ? "aspect-video" : "aspect-square";
  return (
    <div
      className={`${aspectClass} w-full bg-zinc-800 ${className}`}
      aria-hidden
    >
      <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-zinc-700 to-zinc-800">
        <svg
          className="h-12 w-12 text-zinc-600 sm:h-16 sm:w-16"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
    </div>
  );
}
