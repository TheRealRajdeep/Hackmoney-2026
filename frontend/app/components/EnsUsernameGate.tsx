"use client";

import { useCallback, useEffect, useState } from "react";
import { usePlatformWallet } from "@/lib/hooks/usePlatformWallet";
import {
  getEnsStatusForAddress,
  SetUsernameModal,
  setEnsStatusForAddress,
} from "./SetUsernameModal";

/**
 * When the user has an embedded wallet and has not yet set or skipped their
 * ENS username, show the SetUsernameModal. Renders nothing itself; only the modal.
 */
export function EnsUsernameGate() {
  const { platformAddress } = usePlatformWallet();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (
      platformAddress &&
      getEnsStatusForAddress(platformAddress) === null
    ) {
      setShowModal(true);
    }
  }, [platformAddress]);

  const handleClose = useCallback(() => {
    setShowModal(false);
  }, []);

  const handleRegistered = useCallback(() => {
    if (platformAddress) setEnsStatusForAddress(platformAddress, "registered");
  }, [platformAddress]);

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
