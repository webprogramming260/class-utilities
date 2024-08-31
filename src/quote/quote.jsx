import React from 'react';
import './quote.css';

export default function Quote({ onClick }) {
  const [quoteData, setQuoteData] = React.useState('');
  onClick = onClick || (() => {});

  React.useEffect(() => {
    getQuote();
    const timer = setInterval(() => {
      getQuote();
    }, 20000);

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
        console.log(data);
        setQuoteData(data);
      });
  }
}
