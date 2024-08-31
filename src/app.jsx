import React from 'react';
import './app.css';
import Clock from './clock/clock';
import Blank from './blank/blank';
import Joke from './joke/joke';
import Quote from './quote/quote';
import Music from './music/music';
import Timer from './timer/timer';

const utilities = ['blank', 'clock', 'joke', 'quote', 'timer', 'music'];

export default function App() {
  const [utility, setUtility] = React.useState('blank');

  function onClick() {
    setUtility((utility) => {
      const currentIndex = utilities.indexOf(utility);
      const nextIndex = (currentIndex + 1) % utilities.length;
      return utilities[nextIndex];
    });
  }

  React.useEffect(() => {
    document.addEventListener('keypress', (ev) => {
      const newUtility = utilities.find((util) => util.charAt(0) === ev.key);
      if (newUtility) {
        setUtility(newUtility);
      }
    });
  }, []);

  let display = <Blank onClick={onClick} />;
  if (utility === 'clock') {
    display = <Clock onClick={onClick} />;
  } else if (utility === 'joke') {
    display = <Joke onClick={onClick} />;
  } else if (utility === 'quote') {
    display = <Quote onClick={onClick} />;
  } else if (utility === 'timer') {
    display = <Timer onClick={onClick} />;
  } else if (utility === 'music') {
    display = <Music onClick={onClick} />;
  }
  return <div id='app'>{display}</div>;
}
