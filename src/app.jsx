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

const basePath = (import.meta.env.BASE_URL || '/').replace(/\/$/, '') || '';

function getUtilityFromKey(key) {
  const normalizedKey = key.toLowerCase();
  return shortcuts[normalizedKey];
}

function normalizePath(pathname = '') {
  if (!pathname) {
    return '/';
  }

  if (basePath && pathname.startsWith(basePath)) {
    const withoutBase = pathname.slice(basePath.length);
    return withoutBase.startsWith('/') ? withoutBase : `/${withoutBase}`;
  }

  return pathname;
}

function getUtilityFromPath(pathname) {
  const normalizedPath = normalizePath(pathname);
  const keyFromPath = normalizedPath.replace(/^\/+/, '').charAt(0);
  return keyFromPath ? getUtilityFromKey(keyFromPath) : 'blank';
}

function getUtilityFromLocation(location) {
  const params = new URLSearchParams(location.search);
  const pathParam = params.get('path');
  if (pathParam) {
    const utilityFromParam = getUtilityFromPath(pathParam);
    if (utilityFromParam) {
      return utilityFromParam;
    }
  }

  return getUtilityFromPath(location.pathname);
}

function getPathFromUtility(utility) {
  const shortcutEntry = Object.entries(shortcuts).find(([, mappedUtility]) => mappedUtility === utility);
  if (shortcutEntry) {
    return `${basePath}/${shortcutEntry[0]}` || `/${shortcutEntry[0]}`;
  }
  return basePath || '/';
}

export default function App() {
  const [utility, setUtility] = React.useState(() => getUtilityFromLocation(window.location));

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
      setUtility(getUtilityFromLocation(window.location));
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
