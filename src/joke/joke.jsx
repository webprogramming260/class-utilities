import React from 'react';
import './joke.css';

export default function Joke({ onClick }) {
  const [joke, setJoke] = React.useState('...loading joke');
  onClick = onClick || (() => {});
  return (
    <div className='color' onClick={onClick}>
      {joke}
    </div>
  );
}
