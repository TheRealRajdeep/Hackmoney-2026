"use client";

import { useEffect, useState } from "react";
import { createPublicClient, http } from "viem";
import { getEnsName } from "viem/ens";
import { sepolia } from "viem/chains";

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(sepolia.rpcUrls.default.http[0]),
});

/**
 * Resolves the primary ENS name for an address on Sepolia (reverse record).
 * Returns the full name (e.g. "alice.prophit.eth") or null.
 */
export function useEnsName(address: string | null): string | null {
  const [ensName, setEnsName] = useState<string | null>(null);

  useEffect(() => {
    if (!address) {
      setEnsName(null);
      return;
    }
    let cancelled = false;
    getEnsName(publicClient, { address: address as `0x${string}` })
      .then((name) => {
        if (!cancelled && name) setEnsName(name);
      })
      .catch(() => {
        if (!cancelled) setEnsName(null);
      });
    return () => {
      cancelled = true;
    };
  }, [address]);

  return ensName;
}

/** Username (first label) from an ENS name, e.g. "alice" from "alice.prophit.eth" */
export function ensNameToUsername(fullName: string): string {
  const label = fullName.split(".")[0];
  return label ?? fullName;
}
