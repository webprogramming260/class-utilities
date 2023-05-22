import React from 'react';
import './app.css';
import Clock from './clock/clock';
import Blank from './blank/blank';

export default function App() {
  const [utility, setUtility] = React.useState(<Blank />);

  React.useEffect(() => {
    document.addEventListener('keypress', (ev) => {
      switch (ev.key) {
        case 'b': {
          setUtility(<Blank />);
          break;
        }
        case 'c': {
          setUtility(<Clock />);
          break;
        }
      }
      console.log(ev.key);
    });
  }, []);

  return <div id='app'>{utility}</div>;
}
