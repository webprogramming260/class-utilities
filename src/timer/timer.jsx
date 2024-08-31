import React from 'react';
import './timer.css';
import Countdown from './countdown';

export default function Timer({ onClick }) {
  onClick = onClick || (() => {});

  const [minutes, setMinutes] = React.useState(0);
  const [seconds, setSeconds] = React.useState(11);
  const [displayTimer, setDisplayTimer] = React.useState(false);

  return (
    <div className='timer'>
      {displayTimer && (
        <div>
          <Countdown minutes={minutes} seconds={seconds} />
        </div>
      )}
      {!displayTimer && (
        <div className='timer'>
          <div className='controls'>
            <input value={minutes} onChange={(e) => setMinutes(e.target.value)} />
            <div className='separator'>:</div>
            <input value={seconds} onChange={(e) => setSeconds(e.target.value)} />
          </div>
          <button onClick={() => setDisplayTimer(true)}>Start</button>
        </div>
      )}
    </div>
  );
}
