import React from 'react';
import './quote.css';

export default function Quote({ onClick }) {
  const [quoteData, setQuoteData] = React.useState({ quote: '', author: '...loading' });
  const boxRef = React.useRef(null);
  const textRef = React.useRef(null);
  onClick = onClick || (() => {});

  React.useEffect(() => {
    getQuote();
    const timer = setInterval(() => {
      getQuote();
    }, 15000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  // Binary-search the largest font size at which the text fits the box.
  const fit = React.useCallback(() => {
    const box = boxRef.current;
    const text = textRef.current;
    if (!box || !text) return;
    let lo = 8;
    let hi = Math.min(box.clientWidth, box.clientHeight) * 0.1;
    while (hi - lo > 1) {
      const mid = (lo + hi) / 2;
      text.style.fontSize = `${mid}px`;
      if (text.scrollHeight > box.clientHeight || text.scrollWidth > box.clientWidth) {
        hi = mid;
      } else {
        lo = mid;
      }
    }
    text.style.fontSize = `${lo}px`;
  }, []);

  React.useLayoutEffect(() => {
    fit();
  }, [quoteData, fit]);

  React.useEffect(() => {
    const observer = new ResizeObserver(fit);
    observer.observe(boxRef.current);
    return () => observer.disconnect();
  }, [fit]);

  return (
    <div className="quote-display" onClick={onClick}>
      <div className="quote-box" ref={boxRef}>
        <div className="quote-text" key={quoteData.quote} ref={textRef}>
          <div className="quote">{quoteData.quote}</div>
          <div className="author">{quoteData.author}</div>
        </div>
      </div>
    </div>
  );

  function getQuote() {
    fetch('https://quote.cs260.click')
      .then((response) => response.json())
      .then((data) => {
        setQuoteData(data);
      });
  }
}
