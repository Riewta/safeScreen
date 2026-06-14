"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Global scroll-reveal: every <section> on the page gets a slide-up
 * animation when it enters the viewport. No UI changes needed per page.
 */
export function SectionReveal() {
  const pathname = usePathname();

  useEffect(() => {
    // Defer until after React hydration is complete
    const timer = setTimeout(() => {
      const sections = Array.from(document.querySelectorAll("section"));

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              (entry.target as HTMLElement).classList.add("section-revealed");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08 }
      );

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.95) {
          // Already visible — show immediately, no animation
          section.classList.add("section-revealed", "section-no-anim");
        } else {
          section.classList.add("section-hidden");
          observer.observe(section);
        }
      });

      return () => observer.disconnect();
    }, 50);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
