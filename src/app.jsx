import React from 'react';
import './app.css';
import Clock from './clock/clock';
import Blank from './blank/blank';
import Joke from './joke/joke';

export default function App() {
  const [utility, setUtility] = React.useState('blank');

  function onClick() {
    setUtility(utility === 'blank' ? 'clock' : 'blank');
  }

  React.useEffect(() => {
    document.addEventListener('keypress', (ev) => {
      switch (ev.key) {
        case 'b': {
          setUtility('blank');
          break;
        }
        case 'c': {
          setUtility('clock');
          break;
        }
        case 'j': {
          setUtility('joke');
          break;
        }
      }
    });
  }, []);

  let display = <Blank onClick={onClick} />;
  if (utility === 'clock') {
    display = <Clock onClick={onClick} />;
  } else if (utility === 'joke') {
    display = <Joke onClick={onClick} />;
  }
  return <div id='app'>{display}</div>;
}
