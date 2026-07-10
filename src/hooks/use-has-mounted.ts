import * as React from "react";

/**
 * True once the component has mounted on the client, false during SSR
 * and the initial hydration pass. Use this to gate rendering of anything
 * that reads client-only state (localStorage, window, etc.) so the server
 * and first client render match.
 *
 * Implemented with useSyncExternalStore rather than the classic
 * useState + useEffect(() => setMounted(true)) pattern — that pattern
 * calls setState synchronously inside an effect, which newer React
 * versions warn about as a cascading-render risk. useSyncExternalStore
 * is the hook React actually designed for "value differs between server
 * and client" cases like this one.
 */
export function useHasMounted() {
  return React.useSyncExternalStore(
    () => () => {}, // subscribe: nothing to subscribe to, this never changes post-mount
    () => true, // client snapshot
    () => false // server snapshot
  );
}