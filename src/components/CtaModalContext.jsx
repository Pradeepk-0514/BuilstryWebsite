import { createContext, lazy, Suspense, useCallback, useContext, useMemo, useState } from "react";

const CtaModal = lazy(() => import("./CtaModal"));
const CtaModalContext = createContext(null);

export function CtaModalProvider({ children }) {
  const [mode, setMode] = useState(null);
  const openCta = useCallback((nextMode = "inquiry") => {
    if (typeof window !== "undefined") {
      window.__builstryCtaScrollY = window.scrollY;
      window.__builstryLenis?.stop?.();
    }
    setMode(nextMode === "booking" ? "booking" : nextMode === "home-problem" ? "home-problem" : "inquiry");
  }, []);
  const closeCta = useCallback(() => setMode(null), []);
  const value = useMemo(() => ({ openCta }), [openCta]);

  return (
    <CtaModalContext.Provider value={value}>
      {children}
      {mode && (
        <Suspense fallback={null}>
          <CtaModal key={mode} mode={mode} onClose={closeCta} />
        </Suspense>
      )}
    </CtaModalContext.Provider>
  );
}

export function useCtaModal() {
  return useContext(CtaModalContext);
}
