import React from 'react';
import './app.css';
import Clock from './clock/clock';
import Blank from './blank/blank';
import Joke from './joke/joke';
import Quote from './quote/quote';
import Music from './music/music';
import Timer from './timer/timer';
import Demo from './demo/demo';
import News from './news/news';
import Church from './church/church';

const utilities = ['blank', 'clock', 'joke', 'quote', 'timer', 'music', 'demo', 'news', 'church'];

// Church has no first-letter key available (c is clock).
const shortcuts = { l: 'church' };

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
      const newUtility = shortcuts[ev.key] || utilities.find((util) => util.charAt(0) === ev.key);
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
  } else if (utility === 'demo') {
    display = <Demo onClick={onClick} />;
  } else if (utility === 'news') {
    display = <News onClick={onClick} />;
  } else if (utility === 'church') {
    display = <Church onClick={onClick} />;
  }
  return <div id="app">{display}</div>;
}
