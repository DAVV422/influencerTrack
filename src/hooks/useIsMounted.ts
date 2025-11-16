// hooks/useIsMounted.ts
'use client';

import { useState, useEffect } from 'react';

export function useIsMounted() {
  const [mounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Esto solo se ejecuta en el cliente después de la primera renderización
    setIsMounted(true);
  }, []);

  return mounted;
}