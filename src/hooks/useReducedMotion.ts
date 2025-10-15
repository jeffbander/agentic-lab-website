import { useEffect, useState } from 'react';

/**
 * Hook to detect if user prefers reduced motion
 * Respects the prefers-reduced-motion CSS media query
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    // Legacy browsers
    else {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  return prefersReducedMotion;
}

/**
 * Get animation props that respect reduced motion preferences
 * Returns empty object if user prefers reduced motion, otherwise returns the animation props
 */
export function getMotionProps<T extends Record<string, any>>(
  animationProps: T,
  reducedMotion: boolean
): T | Record<string, never> {
  return reducedMotion ? {} : animationProps;
}
