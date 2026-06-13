import { motion } from 'motion/react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const presets = {
  up: { hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0 } },
  left: { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0 } },
  scale: { hidden: { opacity: 0, scale: 0.94 }, visible: { opacity: 1, scale: 1 } },
};

export default function Reveal({
  children,
  as: Tag = motion.div,
  variant = 'up',
  delay = 0,
  className = '',
  stagger = false,
  ...props
}) {
  const reduced = useReducedMotion();
  const preset = presets[variant] || presets.up;

  if (reduced) {
    const Static = Tag === motion.div ? 'div' : 'div';
    return <Static className={className} {...props}>{children}</Static>;
  }

  const motionProps = stagger
    ? {
        initial: 'hidden',
        whileInView: 'visible',
        viewport: { once: true, margin: '-40px' },
        variants: {
          hidden: {},
          visible: { transition: { staggerChildren: 0.08, delayChildren: delay } },
        },
      }
    : {
        initial: preset.hidden,
        whileInView: preset.visible,
        viewport: { once: true, margin: '-40px' },
        transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay },
      };

  return (
    <Tag className={className} {...motionProps} {...props}>
      {stagger
        ? children
        : children}
    </Tag>
  );
}

export function RevealItem({ children, className = '' }) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
      }}
    >
      {children}
    </motion.div>
  );
}
