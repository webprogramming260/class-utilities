import React from 'react';
import './blank.css';

export default function Blank({ onClick }) {
  onClick = onClick || (() => {});
  const [pos, setPos] = React.useState({ x: 100, y: 0 });

  React.useEffect(() => {
    let timer;
    const wander = () => {
      setPos({ x: Math.random() * 100, y: Math.random() * 100 });
      timer = setTimeout(wander, 2000 + Math.random() * 3000);
    };
    wander();
    return () => clearTimeout(timer);
  }, []);

  return <div className="color" onClick={onClick} style={{ '--x': `${pos.x}%`, '--y': `${pos.y}%` }}></div>;
}
