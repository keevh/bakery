"use client";

import { useEffect, useState } from "react";

/**
 * Returns true only after the component has mounted on the client. Used to defer
 * rendering of persisted-store (cart) values so SSR markup matches the first client render.
 */
export function useMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Canonical client-mount detector; the one-time flag flip is intentional.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return mounted;
}
