import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { publicPath } from '../../utils/publicPath';

export default function Button({
  href,
  to,
  variant = 'teal',
  className = '',
  children,
  onClick,
  type = 'button',
  style,
}) {
  const reduced = useReducedMotion();
  const cls = `btn btn-${variant} ${className}`.trim();

  const inner = (
    <>
      {children}
      {!reduced && variant === 'teal' && (
        <motion.span
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(105deg, transparent 38%, rgba(255,255,255,.22) 50%, transparent 62%)',
            pointerEvents: 'none',
          }}
          initial={{ x: '-130%' }}
          whileHover={{ x: '130%' }}
          transition={{ duration: 0.65, ease: 'ease' }}
        />
      )}
    </>
  );

  const wrapStyle = variant === 'teal' ? { position: 'relative', overflow: 'hidden', ...style } : style;

  if (to) {
    return (
      <motion.div whileHover={reduced ? {} : { scale: 1.02 }} whileTap={reduced ? {} : { scale: 0.98 }} style={{ display: 'inline-flex' }}>
        <Link to={to} className={cls} style={wrapStyle} onClick={onClick}>
          {inner}
        </Link>
      </motion.div>
    );
  }

  if (href) {
    const resolvedHref = publicPath(href);
    const isExternal = resolvedHref.startsWith('http') || resolvedHref.startsWith('//');
    return (
      <motion.div whileHover={reduced ? {} : { scale: 1.02 }} whileTap={reduced ? {} : { scale: 0.98 }} style={{ display: 'inline-flex' }}>
        <a href={resolvedHref} className={cls} style={wrapStyle} onClick={onClick} {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
          {inner}
        </a>
      </motion.div>
    );
  }

  return (
    <motion.button
      type={type}
      className={cls}
      style={wrapStyle}
      onClick={onClick}
      whileHover={reduced ? {} : { scale: 1.02 }}
      whileTap={reduced ? {} : { scale: 0.98 }}
    >
      {inner}
    </motion.button>
  );
}
