import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { createHeroScene } from '../hologram/scene.js';
import { publicPath } from '../utils/publicPath';
import '../hologram/hologram.css';

const LOGO = publicPath('/assets/brand/hyper-advance-logo.png');

function formatAngle(prefix, value) {
  const sign = value < 0 ? '-' : '+';
  return `${prefix} ${sign}${Math.abs(value).toFixed(1).padStart(4, '0')}°`;
}

/**
 * Landing page: the Hyper Advance emblem traced from the brand PNG and rendered
 * as an additive point-cloud hologram. The site itself lives behind "Visit Us".
 */
export default function HologramPage() {
  const hostRef = useRef(null);
  const sceneRef = useRef(null);
  const fpsRef = useRef(null);
  const azRef = useRef(null);
  const elRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const host = hostRef.current;

    document.body.classList.add('ha-scroll-lock');

    createHeroScene(host, { logoUrl: LOGO })
      .then((scene) => {
        if (cancelled) {
          scene.dispose();
          return;
        }
        sceneRef.current = scene;
        setPaused(!scene.getReadout().motion);
        requestAnimationFrame(() => setReady(true));
      })
      .catch((error) => {
        console.error('[hologram] init failed', error);
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
      sceneRef.current?.dispose();
      sceneRef.current = null;
      document.body.classList.remove('ha-scroll-lock');
    };
  }, []);

  useEffect(() => {
    if (!ready) return undefined;
    const timer = window.setInterval(() => {
      const scene = sceneRef.current;
      if (!scene) return;
      const { fps, azimuth, elevation } = scene.getReadout();
      if (fpsRef.current) fpsRef.current.textContent = `${String(fps).padStart(2, '0')} FPS`;
      if (azRef.current) azRef.current.textContent = formatAngle('AZ', azimuth);
      if (elRef.current) elRef.current.textContent = formatAngle('EL', elevation);
    }, 220);
    return () => window.clearInterval(timer);
  }, [ready]);

  const toggleMotion = () => {
    const scene = sceneRef.current;
    if (!scene) return;
    const next = !scene.getReadout().motion;
    scene.setMotion(next);
    setPaused(!next);
  };

  return (
    <div className={`ha-holo${ready ? ' is-ready' : ''}${paused ? ' is-paused' : ''}${failed ? ' is-failed' : ''}`}>
      <div className="ha-ground" aria-hidden="true" />
      <div className="ha-stage" ref={hostRef} aria-hidden="true" />
      <div className="ha-vignette" aria-hidden="true" />
      <div className="ha-scanlines" aria-hidden="true" />
      <div className="ha-grain" aria-hidden="true" />

      <div className="ha-skin">
        <div className="ha-topbar">
          <span className="ha-chip">ELV contractor&nbsp;/&nbsp;Malaysia</span>
          <button
            className="ha-icon-btn"
            type="button"
            onClick={toggleMotion}
            aria-pressed={paused}
            aria-label={paused ? 'Resume ambient motion' : 'Pause ambient motion'}
          >
            <svg className="ha-pause" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <rect x="4" y="3" width="2.6" height="10" rx="0.8" fill="currentColor" />
              <rect x="9.4" y="3" width="2.6" height="10" rx="0.8" fill="currentColor" />
            </svg>
            <svg className="ha-play" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M5 3.4v9.2c0 .5.55.8.97.54l7.1-4.6a.65.65 0 0 0 0-1.08l-7.1-4.6A.65.65 0 0 0 5 3.4Z" fill="currentColor" />
            </svg>
          </button>
        </div>

        <div className="ha-bottom">
          <div className="ha-wordmark">
            <h1>Hyper Advance</h1>
            <p>Integrated engineering &amp; ELV systems</p>
          </div>
          <div className="ha-readout" aria-hidden="true">
            <div ref={fpsRef}>-- FPS</div>
            <div>
              <span ref={azRef}>AZ +00.0°</span>
              &nbsp;&nbsp;
              <span ref={elRef}>EL +00.0°</span>
            </div>
          </div>
        </div>
      </div>

      <aside className="ha-portal">
        <p className="ha-portal__eyebrow">Welcome to Hyper Advance</p>
        <h2>Extra low voltage systems, end to end.</h2>
        <p className="ha-portal__lede">
          Nurse call, public address, master clock, AV intercom and lighting control — supplied,
          installed and maintained for hospitals, malls and commercial towers across Malaysia.
        </p>
        <Link className="ha-cta" to="/home">
          Visit Us
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M2.5 8h10M8.8 3.6 13.2 8l-4.4 4.4"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
        <div className="ha-portal__foot">
          <span>Hyper Advance Sdn. Bhd.</span>
          <span>Malaysia</span>
        </div>
      </aside>

      <div className="ha-veil" aria-hidden={ready}>
        <span>{failed ? 'WebGL unavailable' : 'Initialising hologram'}</span>
      </div>
    </div>
  );
}
