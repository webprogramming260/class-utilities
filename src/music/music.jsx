import React from 'react';
import './music.css';
const mp3Files = [
  'music/aqueous.mp3',
  'music/ourHouse.mp3',
  'music/ruleTheWorld.mp3',
  'music/westEndGirls.mp3',
  'music/oxygene.mp3',
  'music/takeOnMe.mp3',
  'music/liftMeUp.mp3',
  'music/feelAlright.mp3',
];

export default function Music() {
  const [playPos, setPlayPos] = React.useState(0);
  const [audio] = React.useState(new Audio(mp3Files[playPos]));
  const [autoPlay, setAutoPlay] = React.useState(true);
  if (autoPlay) {
    audio.play();
  }

  React.useEffect(() => {
    audio.addEventListener('ended', playNextAudio);
    return () => {
      audio.pause();
      audio.removeEventListener('ended', playNextAudio);
    };
  }, [audio, playPos]);

  const playNextAudio = (e) => {
    setPlayPos((prevFile) => (prevFile + 1) % mp3Files.length);
    audio.src = mp3Files[(playPos + 1) % mp3Files.length];
    e.stopPropagation();
  };

  const togglePlay = () => {
    audio.paused ? audio.play() : audio.pause();
    setAutoPlay(!audio.paused);
  };

  const getTitle = (text) => {
    return text.match(/.*\/(.*).mp3$/u)[1];
  };

  return (
    <div className='player' onClick={togglePlay}>
      <div className='title' onClick={playNextAudio}>
        {getTitle(mp3Files[playPos])}
      </div>
    </div>
  );
}
