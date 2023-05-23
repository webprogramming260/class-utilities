import React from 'react';
import './blank.css';

export default function Blank({onClick}) {
  onClick = onClick || (() => {});
  return <div className='color' onClick={onClick}></div>;
}
