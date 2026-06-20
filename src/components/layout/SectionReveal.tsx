"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Global scroll-reveal using data attributes instead of classList,
 * so React never detects a className mismatch during hydration.
 */
export function SectionReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const timer = setTimeout(() => {
      const sections = Array.from(document.querySelectorAll("section"));

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              (entry.target as HTMLElement).setAttribute("data-reveal", "visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08 }
      );

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.95) {
          section.setAttribute("data-reveal", "visible");
          section.setAttribute("data-no-anim", "true");
        } else {
          section.setAttribute("data-reveal", "hidden");
          observer.observe(section);
        }
      });

      return () => observer.disconnect();
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
