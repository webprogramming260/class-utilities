import React from 'react';
import './demo.css';

const STAR_COUNT = 90;
const ORBITS = [
  { size: 34, duration: 9, hue: 190 },
  { size: 48, duration: 15, hue: 230 },
  { size: 62, duration: 24, hue: 280 },
];

export default function Demo({ onClick }) {
  onClick = onClick || (() => {});

  const stars = React.useMemo(
    () =>
      Array.from({ length: STAR_COUNT }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 0.1 + Math.random() * 0.35,
        delay: Math.random() * 6,
        duration: 2 + Math.random() * 4,
      })),
    [],
  );

  return (
    <div className="demo" onClick={onClick}>
      <div className="demo-aurora demo-aurora-1" />
      <div className="demo-aurora demo-aurora-2" />
      <div className="demo-aurora demo-aurora-3" />

      {stars.map((s, i) => (
        <span
          key={i}
          className="demo-star"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}vmin`,
            height: `${s.size}vmin`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}

      <div className="demo-stage">
        <div className="demo-ripple" style={{ animationDelay: '0s' }} />
        <div className="demo-ripple" style={{ animationDelay: '1.5s' }} />
        <div className="demo-ripple" style={{ animationDelay: '3s' }} />

        <div className="demo-blob" />

        {ORBITS.map((o) => (
          <div key={o.size} className="demo-orbit" style={{ '--size': `${o.size}vmin`, '--dur': `${o.duration}s`, '--hue': o.hue }}>
            <div className="demo-planet" />
          </div>
        ))}

        <div className="demo-float">
          <div className="demo-cube">
            <div className="demo-face demo-front" />
            <div className="demo-face demo-back" />
            <div className="demo-face demo-right" />
            <div className="demo-face demo-left" />
            <div className="demo-face demo-top" />
            <div className="demo-face demo-bottom" />
          </div>
        </div>
      </div>

      <h1 className="demo-title">
        {'CS 260'.split('').map((c, i) => (
          <span key={i} style={{ '--i': i }}>
            {c === ' ' ? '\u00a0' : c}
          </span>
        ))}
      </h1>
    </div>
  );
}
