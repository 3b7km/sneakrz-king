import { useState, useCallback } from "react";

export function useLoadingStates() {
  const [loadingStates, setLoadingStates] = useState({});

  const setLoading = useCallback((key, isLoading) => {
    setLoadingStates((prev) => ({
      ...prev,
      [key]: isLoading,
    }));
  }, []);

  const isLoading = useCallback(
    (key) => {
      return Boolean(loadingStates[key]);
    },
    [loadingStates],
  );

  return {
    loadingStates: {
      ...loadingStates,
      setLoading,
      isLoading,
    },
  };
}
