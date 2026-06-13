/**
 * Adapted from aceternity/hero-highlight (21st.dev)
 * @see https://21st.dev/community/components/aceternity/hero-highlight
 */
import { motion, useMotionTemplate, useMotionValue } from 'motion/react';

export function HeroHighlight({ children, className = '' }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove(e) {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  }

  const background = useMotionTemplate`radial-gradient(650px circle at ${mouseX}px ${mouseY}px, rgba(62,193,213,0.15), transparent 80%)`;

  return (
    <div className={`hero-highlight ${className}`} onMouseMove={handleMouseMove}>
      <motion.div className="hero-highlight-glow" style={{ background }} />
      <div className="hero-highlight-content">{children}</div>
    </div>
  );
}

export function Highlight({ children, className = '' }) {
  return (
    <motion.span
      className={`hero-text-highlight ${className}`}
      initial={{ backgroundSize: '0% 100%' }}
      animate={{ backgroundSize: '100% 100%' }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
    >
      {children}
    </motion.span>
  );
}
