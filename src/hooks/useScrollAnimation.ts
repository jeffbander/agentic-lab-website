import { useInView } from 'react-intersection-observer';

export function useScrollAnimation(options?: {
  triggerOnce?: boolean;
  threshold?: number;
  delay?: number;
}) {
  const { ref, inView } = useInView({
    triggerOnce: options?.triggerOnce ?? true,
    threshold: options?.threshold ?? 0.1,
  });

  return { ref, inView };
}
