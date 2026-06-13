import { useEffect, useRef, useState } from 'react';
import { animate, useInView, useMotionValue, useTransform } from 'motion/react';
import { useReducedMotion } from './useReducedMotion';

export function useCounter(target, suffix = '') {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduced = useReducedMotion();
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.floor(v));
  const [display, setDisplay] = useState(`0${suffix}`);

  useEffect(() => {
    return rounded.on('change', (v) => setDisplay(`${v}${suffix}`));
  }, [rounded, suffix]);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setDisplay(`${target}${suffix}`);
      return;
    }
    const controls = animate(count, target, { duration: 1.8, ease: [0.22, 1, 0.36, 1] });
    return () => controls.stop();
  }, [inView, target, suffix, reduced, count]);

  return { ref, display };
}
