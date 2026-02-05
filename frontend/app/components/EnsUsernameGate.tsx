"use client";

import { useCallback, useEffect, useState } from "react";
import { usePlatformWallet } from "@/lib/hooks/usePlatformWallet";
import { fetchEnsStatusForAddress, SetUsernameModal } from "./SetUsernameModal";

/**
 * When the user has an embedded wallet and has not yet set or skipped their
 * ENS username (in DB), show the SetUsernameModal. Renders nothing itself; only the modal.
 */
export function EnsUsernameGate() {
  const { platformAddress } = usePlatformWallet();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!platformAddress) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetchEnsStatusForAddress(platformAddress).then((status) => {
      if (!cancelled && status === null) setShowModal(true);
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [platformAddress]);

  const handleClose = useCallback(() => {
    setShowModal(false);
  }, []);

  const handleRegistered = useCallback(() => {
    setShowModal(false);
  }, []);

  if (!showModal || !platformAddress) return null;

  return (
    <SetUsernameModal
      open={showModal}
      onClose={handleClose}
      platformAddress={platformAddress}
      onRegistered={handleRegistered}
    />
  );
}
