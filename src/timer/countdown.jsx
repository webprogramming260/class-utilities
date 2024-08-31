import React from 'react';
import Digit from './digit.jsx';
import './countdown.css';

function getDigit(pos, str) {
  const digitMap = {
    0: ['t', 'tr', 'tl', 'br', 'bl', 'b'],
    1: ['tr', 'br'],
    2: ['t', 'tr', 'm', 'bl', 'b'],
    3: ['t', 'tr', 'm', 'br', 'b'],
    4: ['tl', 'm', 'tr', 'br'],
    5: ['t', 'tl', 'm', 'br', 'b'],
    6: ['t', 'tl', 'm', 'bl', 'br', 'b'],
    7: ['t', 'tr', 'br'],
    8: ['t', 'tr', 'tl', 'm', 'br', 'bl', 'b'],
    9: ['t', 'tl', 'tr', 'm', 'br'],
  };
  if (pos === 0) {
    return digitMap[Number(str.length === 1 ? '0' : str.slice(0, 1))];
  }
  return digitMap[Number(str.length === 1 ? str : str.slice(1))];
}

const timerSecondNoise = new Audio('timerSecond.mp3');
const timerEndNoise = new Audio('music/aqueous.mp3');

export default function Countdown({ minutes, seconds }) {
  const [time, setTime] = React.useState(new Date(minutes * 60000 + seconds * 1000));
  const [minute1, setMinute1] = React.useState([]);
  const [minute2, setMinute2] = React.useState([]);
  const [second1, setSecond1] = React.useState([]);
  const [second2, setSecond2] = React.useState([]);

  React.useEffect(() => {
    const minutes = time.getMinutes().toString();
    const seconds = time.getSeconds().toString();

    setMinute1(getDigit(0, minutes));
    setMinute2(getDigit(1, minutes));
    setSecond1(getDigit(0, seconds));
    setSecond2(getDigit(1, seconds));
  }, [time]);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime) => {
        const newTime = new Date(prevTime - 1000);
        if (newTime.getTime() <= 0) {
          timerEndNoise.play();
          clearInterval(timer);
          document.querySelector('.timer').classList.add('timer-expired');
          document.querySelector('.timer').classList.remove('timer-flash');
        } else {
          if (newTime.getTime() < 15000) {
            timerSecondNoise.play();
          }
          if (newTime.getTime() < 5000) {
            document.querySelector('.timer').classList.add('timer-flash');
          }
        }
        return newTime;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className={`countdown`}>
      <Digit activePieces={minute1} />
      <Digit activePieces={minute2} />
      <div className='separator'>:</div>
      <Digit activePieces={second1} />
      <Digit activePieces={second2} />
    </div>
  );
}
