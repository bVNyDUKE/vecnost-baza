import { useSyncExternalStore } from "react";

export function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true, // client snapshot
    () => false // server snapshot
  );
}
