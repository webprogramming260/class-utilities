import React from 'react';
import './music.css';
const mp3Files = ['music/aqueous.mp3', 'music/test.mp3'];

export default function Music() {
  const [currentFile, setCurrentFile] = React.useState(0);
  const [audio] = React.useState(new Audio(mp3Files[currentFile]));
  const [autoPlay, setAutoPlay] = React.useState(true);
  if (autoPlay) {
    audio.play();
  }

  React.useEffect(() => {
    audio.addEventListener('ended', playNextAudio);
    return () => {
      audio.removeEventListener('ended', playNextAudio);
    };
  }, [audio, currentFile]);

  const playNextAudio = (e) => {
    setCurrentFile((prevFile) => (prevFile + 1) % mp3Files.length);
    audio.src = mp3Files[(currentFile + 1) % mp3Files.length];
    e.stopPropagation();
  };

  const togglePlay = () => {
    audio.paused ? audio.play() : audio.pause();
    setAutoPlay(!audio.paused);
  };

  return (
    <div className='player' onClick={togglePlay}>
      <div className='title' onClick={playNextAudio}>
        {mp3Files[currentFile]}
      </div>
    </div>
  );
}
