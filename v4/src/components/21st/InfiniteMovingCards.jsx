/**
 * Adapted from aceternity/infinite-moving-cards (21st.dev)
 * @see https://21st.dev/community/components/aceternity/infinite-moving-cards
 */
import { useEffect, useRef, useState } from 'react';

export default function InfiniteMovingCards({
  items,
  direction = 'left',
  speed = 'normal',
  pauseOnHover = true,
  className = '',
}) {
  const containerRef = useRef(null);
  const scrollerRef = useRef(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !scrollerRef.current) return;

    const scroller = scrollerRef.current;
    Array.from(scroller.children).forEach((child) => {
      scroller.appendChild(child.cloneNode(true));
    });

    const durations = { fast: '20s', normal: '36s', slow: '60s' };
    containerRef.current.style.setProperty('--animation-duration', durations[speed] || durations.normal);
    containerRef.current.style.setProperty('--animation-direction', direction === 'left' ? 'forwards' : 'reverse');
    setStart(true);
  }, [direction, speed, items]);

  return (
    <div
      ref={containerRef}
      className={`infinite-cards-scroller${pauseOnHover ? ' pause-on-hover' : ''}${start ? ' animate' : ''} ${className}`}
    >
      <ul ref={scrollerRef} className="infinite-cards-track">
        {items.map((item, idx) => (
          <li key={`${item.name}-${idx}`} className="infinite-card">
            <blockquote>
              <span className="infinite-card-icon"><i className="fa-solid fa-circle" /></span>
              <span className="infinite-card-quote">{item.quote}</span>
              <footer>
                <span className="infinite-card-name">{item.name}</span>
                <span className="infinite-card-title">{item.title}</span>
              </footer>
            </blockquote>
          </li>
        ))}
      </ul>
    </div>
  );
}
