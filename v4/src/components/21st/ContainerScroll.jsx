/**
 * Adapted from aceternity/container-scroll-animation (21st.dev)
 * @see https://21st.dev/community/components/aceternity/container-scroll-animation
 */
import { motion, useScroll, useTransform } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

export default function ContainerScroll({ titleComponent, children }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start end', 'end start'] });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const scaleRange = isMobile ? [0.88, 1] : [1.05, 1];
  const rotate = useTransform(scrollYProgress, [0, 1], [14, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], scaleRange);
  const translate = useTransform(scrollYProgress, [0, 1], [0, -80]);

  return (
    <div className="container-scroll" ref={containerRef}>
      <div className="container-scroll-inner" style={{ perspective: '1000px' }}>
        <motion.div className="container-scroll-header" style={{ translateY: translate }}>
          {titleComponent}
        </motion.div>
        <motion.div
          className="container-scroll-card"
          style={{ rotateX: rotate, scale, transformStyle: 'preserve-3d' }}
        >
          <div className="container-scroll-card-inner">{children}</div>
        </motion.div>
      </div>
    </div>
  );
}
