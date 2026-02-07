"use client";

import { useEffect, useState } from "react";
import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(sepolia.rpcUrls.default.http[0]),
});

export interface UseEnsNameResult {
  ensName: string | null;
  isLoading: boolean;
}

/**
 * Resolves the primary ENS name for an address on Sepolia (reverse record).
 * Calls reverse(bytes) on ENS Universal Resolver to get the primary name.
 * Returns the full name (e.g. "alice.prophit.eth") or null.
 * @see https://viem.sh/docs/ens/actions/getEnsName
 */
export function useEnsName(address: string | null): UseEnsNameResult {
  const [ensName, setEnsName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!address) {
      setEnsName(null);
      setIsLoading(false);
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    publicClient
      .getEnsName({ address: address as `0x${string}` })
      .then((name) => {
        if (!cancelled) {
          setEnsName(name ?? null);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setEnsName(null);
          setIsLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [address]);

  useEffect(() => {
    if (!address) return;
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ address: string }>).detail;
      if (detail?.address === address.toLowerCase()) {
        setIsLoading(true);
        publicClient
          .getEnsName({ address: address as `0x${string}` })
          .then((name) => {
            setEnsName(name ?? null);
            setIsLoading(false);
          })
          .catch(() => {
            setEnsName(null);
            setIsLoading(false);
          });
      }
    };
    window.addEventListener("prophit-ens-registered", handler);
    return () => window.removeEventListener("prophit-ens-registered", handler);
  }, [address]);

  return { ensName, isLoading };
}

/** Username (first label) from an ENS name, e.g. "alice" from "alice.prophit.eth" */
export function ensNameToUsername(fullName: string): string {
  const label = fullName.split(".")[0];
  return label ?? fullName;
}
