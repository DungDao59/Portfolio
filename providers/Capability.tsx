"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { Capability, SSR_DEFAULT, detectCapability } from "@/lib/capability";

const CapabilityContext = createContext<Capability>(SSR_DEFAULT);

export function CapabilityProvider({ children }: { children: React.ReactNode }) {
  const [cap, setCap] = useState<Capability>(SSR_DEFAULT);
  useEffect(() => {
    setCap(detectCapability(window));
  }, []);
  return (
    <CapabilityContext.Provider value={cap}>
      {children}
    </CapabilityContext.Provider>
  );
}

export const useCapability = () => useContext(CapabilityContext);
