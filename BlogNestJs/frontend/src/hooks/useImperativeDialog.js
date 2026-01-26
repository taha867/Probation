import { useState, useCallback } from "react";

export const useImperativeDialog = (initialPayload = null) => {
  const [isOpen, setIsOpen] = useState(false);
  const [payload, setPayload] = useState(initialPayload);

  const openDialog = useCallback((nextPayload) => {
    setIsOpen(true);
    setPayload(nextPayload ?? null);
  }, []);

  const closeDialog = useCallback(() => {
    setIsOpen(false);
    setPayload(initialPayload ?? null);
  }, [initialPayload]);

  return {
    isOpen,
    payload,
    openDialog,
    closeDialog,
  };
};


