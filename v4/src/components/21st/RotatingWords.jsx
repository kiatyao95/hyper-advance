/**
 * Adapted from serafimcloud/animated-hero (21st.dev)
 * @see https://21st.dev/community/components/serafimcloud/animated-hero
 */
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';

export default function RotatingWords({ words, interval = 2200, className = '' }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % words.length), interval);
    return () => clearInterval(t);
  }, [words.length, interval]);

  return (
    <span className={`rotating-words ${className}`}>
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          className="rotating-words-item"
          initial={{ y: 18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -18, opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
