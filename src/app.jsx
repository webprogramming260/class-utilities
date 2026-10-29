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

const utilities = ['blank', 'clock', 'joke', 'quote', 'demo', 'news', 'church', 'timer', 'music'];

const shortcuts = { b: 'blank', c: 'clock', j: 'joke', q: 'quote', t: 'timer', m: 'music', d: 'demo', n: 'news', l: 'church' };

function getUtilityFromKey(key) {
  const normalizedKey = key.toLowerCase();
  return shortcuts[normalizedKey];
}

function getUtilityFromPath(pathname) {
  const keyFromPath = pathname.replace(/^\/+/, '').charAt(0);
  return keyFromPath ? getUtilityFromKey(keyFromPath) : 'blank';
}

function getPathFromUtility(utility) {
  const shortcutEntry = Object.entries(shortcuts).find(([, mappedUtility]) => mappedUtility === utility);
  if (shortcutEntry) {
    return `/${shortcutEntry[0]}`;
  }
  return utility === 'blank' ? '/' : `/${utility.charAt(0)}`;
}

export default function App() {
  const [utility, setUtility] = React.useState(() => getUtilityFromPath(window.location.pathname));

  function onClick() {
    setUtility((utility) => {
      const currentIndex = utilities.indexOf(utility);
      const nextIndex = (currentIndex + 1) % utilities.length;
      return utilities[nextIndex];
    });
  }

  React.useEffect(() => {
    const onKeyPress = (ev) => {
      const newUtility = getUtilityFromKey(ev.key);
      if (newUtility) {
        setUtility(newUtility);
      }
    };

    const onPopState = () => {
      setUtility(getUtilityFromPath(window.location.pathname));
    };

    document.addEventListener('keypress', onKeyPress);
    window.addEventListener('popstate', onPopState);

    return () => {
      document.removeEventListener('keypress', onKeyPress);
      window.removeEventListener('popstate', onPopState);
    };
  }, []);

  React.useEffect(() => {
    const nextPath = getPathFromUtility(utility);
    if (window.location.pathname !== nextPath) {
      window.history.pushState(null, '', nextPath);
    }
  }, [utility]);

  let display = <Blank onClick={onClick} />;
  if (utility === 'clock') {
    display = <Clock onClick={onClick} />;
  } else if (utility === 'joke') {
    display = <Joke onClick={onClick} />;
  } else if (utility === 'quote') {
    display = <Quote onClick={onClick} />;
  } else if (utility === 'music') {
    display = <Music onClick={onClick} />;
  } else if (utility === 'demo') {
    display = <Demo onClick={onClick} />;
  } else if (utility === 'news') {
    display = <News onClick={onClick} />;
  } else if (utility === 'church') {
    display = <Church onClick={onClick} />;
  } else if (utility === 'timer') {
    display = <Timer onClick={onClick} />;
  }
  return <div id="app">{display}</div>;
}
