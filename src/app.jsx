import React from 'react';
import './app.css';
import Clock from './clock/clock';
import Blank from './blank/blank';
import Joke from './joke/joke';
import Quote from './quote/quote';
import Music from './music/music';

const utilities = ['blank', 'clock', 'joke', 'quote', 'music'];

export default function App() {
  const [utility, setUtility] = React.useState('quote');

  function onClick() {
    setUtility((utility) => {
      const currentIndex = utilities.indexOf(utility);
      const nextIndex = (currentIndex + 1) % utilities.length;
      return utilities[nextIndex];
    });
  }

  React.useEffect(() => {
    document.addEventListener('keypress', (ev) => {
      setUtility(utilities.find((util) => util.charAt(0) === ev.key));
    });
  }, []);

  let display = <Blank onClick={onClick} />;
  if (utility === 'clock') {
    display = <Clock onClick={onClick} />;
  } else if (utility === 'joke') {
    display = <Joke onClick={onClick} />;
  } else if (utility === 'quote') {
    display = <Quote onClick={onClick} />;
  } else if (utility === 'music') {
    display = <Music onClick={onClick} />;
  }
  return <div id='app'>{display}</div>;
}
