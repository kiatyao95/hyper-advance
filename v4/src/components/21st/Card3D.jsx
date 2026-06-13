/**
 * Adapted from aceternity/3d-card-effect (21st.dev)
 * @see https://21st.dev/community/components/aceternity/3d-card-effect
 */
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'motion/react';

export default function Card3D({ children, className = '' }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);
  const rotateX = useSpring(rawRotateX, { stiffness: 300, damping: 30 });
  const rotateY = useSpring(rawRotateY, { stiffness: 300, damping: 30 });

  function onMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rawRotateX.set(py * -14);
    rawRotateY.set(px * 14);
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
  }

  function onMouseLeave() {
    rawRotateX.set(0);
    rawRotateY.set(0);
  }

  const glare = useMotionTemplate`radial-gradient(400px circle at ${x}px ${y}px, rgba(62,193,213,0.18), transparent 60%)`;

  return (
    <motion.div
      className={`card-3d ${className}`}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
    >
      <motion.div className="card-3d-glare" style={{ background: glare }} />
      <div className="card-3d-content">{children}</div>
    </motion.div>
  );
}
