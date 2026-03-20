import { useEffect, useRef } from "react";

export function useScrollReveal<T extends HTMLElement>(
  animationClass = "animate-reveal-up",
  threshold = 0.2
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add(animationClass);
          observer.unobserve(el);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [animationClass, threshold]);

  return ref;
}
