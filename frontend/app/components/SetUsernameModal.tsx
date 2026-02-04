"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useCallback, useEffect, useState } from "react";
import { ENS_PARENT_DOMAIN, ENS_SUBDOMAIN_LABEL_REGEX } from "@/lib/constants";

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

const STORAGE_KEY_PREFIX = "prophit_ens_";
const STORAGE_USERNAME_PREFIX = "prophit_ens_username_";

function getStorageKey(address: string) {
  return `${STORAGE_KEY_PREFIX}${address.toLowerCase()}`;
}

function getUsernameStorageKey(address: string) {
  return `${STORAGE_USERNAME_PREFIX}${address.toLowerCase()}`;
}

export type EnsModalStatus = "registered" | "skipped" | null;

export function getEnsStatusForAddress(address: string | null): EnsModalStatus {
  if (typeof window === "undefined" || !address) return null;
  const raw = localStorage.getItem(getStorageKey(address));
  if (raw === "registered" || raw === "skipped") return raw;
  return null;
}

export function setEnsStatusForAddress(address: string, status: "registered" | "skipped") {
  localStorage.setItem(getStorageKey(address), status);
}

/** ENS username (subdomain label) for display, e.g. "alice" from alice.prophit.eth */
export function getEnsUsernameForAddress(address: string | null): string | null {
  if (typeof window === "undefined" || !address) return null;
  return localStorage.getItem(getUsernameStorageKey(address));
}

export function setEnsUsernameForAddress(address: string, username: string) {
  localStorage.setItem(getUsernameStorageKey(address), username);
  window.dispatchEvent(
    new CustomEvent("prophit-ens-registered", { detail: { address: address.toLowerCase() } })
  );
}

interface SetUsernameModalProps {
  open: boolean;
  onClose: () => void;
  platformAddress: string | null;
  onRegistered?: (ensName: string) => void;
}

export function SetUsernameModal({
  open,
  onClose,
  platformAddress,
  onRegistered,
}: SetUsernameModalProps) {
  const { getAccessToken } = usePrivy();
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const normalized = username.trim().toLowerCase();
  const preview = normalized ? `${normalized}.${ENS_PARENT_DOMAIN}` : "";
  const isValid =
    normalized.length >= 3 &&
    normalized.length <= 63 &&
    ENS_SUBDOMAIN_LABEL_REGEX.test(normalized);

  const handleRegister = useCallback(async () => {
    if (!platformAddress || !getAccessToken || !isValid) return;
    setError(null);
    setLoading(true);
    try {
      const token = await getAccessToken();
      const res = await fetch("/api/ens/register-subdomain", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          username: normalized,
          ownerAddress: platformAddress,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ensName) {
        setSuccess(data.ensName);
        setEnsStatusForAddress(platformAddress, "registered");
        setEnsUsernameForAddress(platformAddress, normalized);
        onRegistered?.(data.ensName);
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        const msg = [data.error, data.details].filter(Boolean).join(": ") || "Registration failed";
        setError(msg);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [platformAddress, getAccessToken, isValid, normalized, onRegistered, onClose]);

  const handleSkip = useCallback(() => {
    if (platformAddress) setEnsStatusForAddress(platformAddress, "skipped");
    onClose();
  }, [platformAddress, onClose]);

  useEffect(() => {
    if (open) {
      setUsername("");
      setError(null);
      setSuccess(null);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex min-h-screen items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="set-username-modal-title"
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={success ? undefined : handleSkip}
        aria-hidden
      />
      <div className="relative mx-auto w-full max-w-md rounded-xl border border-border-default bg-bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border-default px-4 py-3">
          <h2 id="set-username-modal-title" className="text-lg font-semibold text-white">
            Set your Prophit username
          </h2>
          <button
            type="button"
            onClick={handleSkip}
            className="rounded p-1.5 text-zinc-400 hover:bg-bg-elevated hover:text-white transition-colors"
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="px-4 py-4">
          <p className="text-sm text-text-muted mb-4">
            Choose an ENS subdomain under <span className="font-mono text-accent-cyan">{ENS_PARENT_DOMAIN}</span>. It will point to your embedded wallet.
          </p>

          {success ? (
            <div className="rounded-lg border border-accent/30 bg-accent-cyan-muted p-4 text-center">
              <p className="font-medium text-white">Registered</p>
              <p className="mt-1 font-mono text-sm text-accent-cyan">{success}</p>
            </div>
          ) : (
            <>
              <label htmlFor="ens-username" className="block text-sm font-medium text-text-muted mb-1.5">
                Username
              </label>
              <div className="flex items-center gap-2 mb-1">
                <input
                  id="ens-username"
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError(null);
                  }}
                  placeholder="alice"
                  className="flex-1 rounded-lg border border-border-default bg-bg-elevated px-3 py-2.5 text-white placeholder:text-text-subtle focus:border-accent focus:outline-none"
                  autoComplete="username"
                  disabled={loading}
                />
                <span className="text-text-muted shrink-0">.{ENS_PARENT_DOMAIN}</span>
              </div>
              {preview && (
                <p className="text-xs text-text-subtle mb-3">
                  Preview: <span className="font-mono text-text-muted">{preview}</span>
                </p>
              )}
              {error && (
                <p className="text-sm text-red-400 mb-3" role="alert">
                  {error}
                </p>
              )}
              <p className="text-xs text-text-subtle mb-4">
                3–63 characters, lowercase letters, numbers, and hyphens only.
              </p>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSkip}
                  className="flex-1 rounded-lg border border-border-default bg-bg-elevated px-4 py-2.5 text-sm font-medium text-text-muted hover:bg-bg-card hover:text-white transition-colors"
                >
                  Skip
                </button>
                <button
                  type="button"
                  onClick={handleRegister}
                  disabled={!isValid || loading}
                  className="flex-1 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-50 disabled:pointer-events-none transition-colors"
                >
                  {loading ? "Registering…" : "Register"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
