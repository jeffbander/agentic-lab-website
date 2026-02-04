import { useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { animate } from 'framer-motion';

interface AnimatedCounterProps {
  from?: number;
  to: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  className?: string;
}

export function AnimatedCounter({
  from = 0,
  to,
  duration = 2,
  suffix = '',
  prefix = '',
  decimals = 0,
  className = '',
}: AnimatedCounterProps) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5
  });

  useEffect(() => {
    if (!inView || !nodeRef.current) return;

    const node = nodeRef.current;
    const controls = animate(from, to, {
      duration,
      onUpdate(value) {
        node.textContent = `${prefix}${value.toFixed(decimals)}${suffix}`;
      },
    });

    return () => controls.stop();
  }, [from, to, duration, suffix, prefix, decimals, inView]);

  return (
    <div ref={ref} className={className}>
      <span ref={nodeRef}>{prefix}{from.toFixed(decimals)}{suffix}</span>
    </div>
  );
}
