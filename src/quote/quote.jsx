import React from 'react';
import './quote.css';

export default function Quote({ onClick }) {
  const [quoteData, setQuoteData] = React.useState({ quote: '', author: '...loading' });
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

  return (
    <div className='display' onClick={onClick}>
      <div className='quote'>{quoteData.quote}</div>
      <div className='author'>{quoteData.author}</div>
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
