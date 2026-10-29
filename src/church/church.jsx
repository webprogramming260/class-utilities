import React from 'react';
import './church.css';

const quotes = [
  { quote: 'Try a little harder to be a little better.', author: 'Gordon B. Hinckley' },
  { quote: 'Be grateful. Be smart. Be clean. Be true. Be humble. Be prayerful.', author: 'Gordon B. Hinckley' },
  { quote: 'Never let a problem to be solved become more important than a person to be loved.', author: 'Thomas S. Monson' },
  {
    quote: 'The joy we feel has little to do with the circumstances of our lives and everything to do with the focus of our lives.',
    author: 'Russell M. Nelson',
  },
  { quote: 'Think celestial!', author: 'Russell M. Nelson' },
  { quote: 'Happiness is the object and design of our existence.', author: 'Joseph Smith' },
  {
    quote: 'Men and women who turn their lives over to God will discover that He can make a lot more of their lives than they can.',
    author: 'Ezra Taft Benson',
  },
  { quote: 'No other success can compensate for failure in the home.', author: 'David O. McKay' },
  {
    quote: 'God does notice us, and He watches over us. But it is usually through another person that He meets our needs.',
    author: 'Spencer W. Kimball',
  },
  { quote: "Don't you quit. You keep walking. You keep trying. There is help and happiness ahead.", author: 'Jeffrey R. Holland' },
  { quote: 'God is in relentless pursuit of you.', author: 'Patrick Kearon' },
  { quote: 'Let God prevail.', author: 'Russell M. Nelson' },
  { quote: 'Lift where you stand.', author: 'Dieter F. Uchtdorf' },
  { quote: 'Doubt your doubts before you doubt your faith.', author: 'Dieter F. Uchtdorf' },
  { quote: 'Come what may, and love it.', author: 'Joseph B. Wirthlin' },
  { quote: 'Faith in God includes faith in His timing.', author: 'Neal A. Maxwell' },
  { quote: 'The Lord loves effort.', author: 'Russell M. Nelson' },
  { quote: 'Forget yourself and go to work.', author: 'Gordon B. Hinckley' },
  { quote: 'Love one another; as I have loved you.', author: 'Jesus Christ' },
  { quote: 'Peace I leave with you, my peace I give unto you.', author: 'Jesus Christ' },
  { quote: 'Come unto me, all ye that labour and are heavy laden, and I will give you rest.', author: 'Jesus Christ' },
  { quote: 'With God all things are possible.', author: 'Jesus Christ' },
  { quote: 'I am the light of the world.', author: 'Jesus Christ' },
  { quote: 'I am the way, the truth, and the life.', author: 'Jesus Christ' },
  { quote: 'If ye love me, keep my commandments.', author: 'Jesus Christ' },
  { quote: 'Ask, and it shall be given you; seek, and ye shall find.', author: 'Jesus Christ' },
  { quote: 'I can do all things through Christ which strengtheneth me.', author: 'Paul' },
  { quote: 'For we walk by faith, not by sight.', author: 'Paul' },
  { quote: 'Lord, to whom shall we go? thou hast the words of eternal life.', author: 'Peter' },
  { quote: 'I will go and do the things which the Lord hath commanded.', author: 'Nephi' },
  {
    quote: 'When ye are in the service of your fellow beings ye are only in the service of your God.',
    author: 'King Benjamin',
  },
  { quote: 'Men are, that they might have joy.', author: 'Lehi' },
  { quote: 'By small and simple things are great things brought to pass.', author: 'Alma' },
  { quote: 'Wickedness never was happiness.', author: 'Alma' },
  {
    quote: 'Feast upon the words of Christ; for behold, the words of Christ will tell you all things what ye should do.',
    author: 'Nephi',
  },
  { quote: 'If men come unto me I will show unto them their weakness.', author: 'Mormon' },
  { quote: 'Just because something is good is not a sufficient reason for doing it.', author: 'Dallin H. Oaks' },
  { quote: 'Things will work out. Keep an even keel and keep moving forward.', author: 'Gordon B. Hinckley' },
  {
    quote: 'The past is behind, learn from it. The future is ahead, prepare for it. The present is here, live in it.',
    author: 'Thomas S. Monson',
  },
];

const nextIndex = (current) => {
  let next;
  do {
    next = Math.floor(Math.random() * quotes.length);
  } while (next === current);
  return next;
};

export default function Church({ onClick }) {
  const [index, setIndex] = React.useState(() => nextIndex(-1));
  const boxRef = React.useRef(null);
  const textRef = React.useRef(null);
  onClick = onClick || (() => {});

  React.useEffect(() => {
    const timer = setInterval(() => {
      setIndex((current) => nextIndex(current));
    }, 15000);
    return () => clearInterval(timer);
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
  }, [index, fit]);

  React.useEffect(() => {
    const observer = new ResizeObserver(fit);
    observer.observe(boxRef.current);
    return () => observer.disconnect();
  }, [fit]);

  const { quote, author } = quotes[index];

  return (
    <div className="church-display" onClick={onClick}>
      <div className="church-box" ref={boxRef}>
        <div className="church-text" key={index} ref={textRef}>
          <div className="quote">{quote}</div>
          <div className="author">{author}</div>
        </div>
      </div>
    </div>
  );
}
