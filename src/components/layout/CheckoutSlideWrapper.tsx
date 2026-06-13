"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";

const CHECKOUT_STEPS = ["/cart", "/checkout", "/coupon", "/checkout/address", "/checkout/tax-invoice", "/payment", "/order-confirmation"];

function getStep(pathname: string) {
  return CHECKOUT_STEPS.findIndex(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
}

type Panel = { key: string; node: ReactNode; exiting: boolean; forward: boolean };

export function CheckoutSlideWrapper({ children }: { children: ReactNode }) {
  const pathname  = usePathname();
  const stepIndex = getStep(pathname);

  const [panels, setPanels] = useState<Panel[]>([
    { key: pathname, node: children, exiting: false, forward: true },
  ]);
  const prevPathRef = useRef(pathname);
  const prevStepRef = useRef(stepIndex);

  useEffect(() => {
    if (pathname === prevPathRef.current) {
      // Same route — just update content (e.g. state change inside page)
      setPanels((prev) =>
        prev.map((p) => (p.key === pathname ? { ...p, node: children } : p))
      );
      return;
    }

    const newStep    = getStep(pathname);
    const oldStep    = prevStepRef.current;
    const bothInFlow = newStep >= 0 && oldStep >= 0;

    if (bothInFlow) {
      const forward = newStep > oldStep;
      setPanels((prev) => [
        ...prev.map((p) => ({ ...p, exiting: true, forward })),
        { key: pathname, node: children, exiting: false, forward },
      ]);
      const t = setTimeout(
        () => setPanels([{ key: pathname, node: children, exiting: false, forward }]),
        320
      );
      prevPathRef.current = pathname;
      prevStepRef.current = newStep;
      return () => clearTimeout(t);
    }

    // Leaving or entering checkout flow without sibling step — no animation
    setPanels([{ key: pathname, node: children, exiting: false, forward: true }]);
    prevPathRef.current = pathname;
    prevStepRef.current = newStep;
  }, [pathname, children]);

  // Not in checkout flow — render normally
  if (stepIndex < 0 && panels.length === 1 && !panels[0].exiting) {
    return <>{children}</>;
  }

  return (
    <div className="relative" style={{ overflowX: "clip" }}>
      {panels.map((panel) => (
        <div
          key={panel.key}
          style={
            panel.exiting
              ? {
                  position: "absolute",
                  inset: 0,
                  animation: `${panel.forward ? "slideOutToLeft" : "slideOutToRight"} 300ms cubic-bezier(0.4,0,0.2,1) forwards`,
                  pointerEvents: "none",
                }
              : panels.length > 1
              ? {
                  animation: `${panel.forward ? "slideInFromRight" : "slideInFromLeft"} 300ms cubic-bezier(0.4,0,0.2,1) forwards`,
                }
              : undefined
          }
        >
          {panel.node}
        </div>
      ))}
    </div>
  );
}
