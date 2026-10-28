import React from 'react';
import './music.css';

const mp3Files = ['music/aqueous.mp3', 'music/allDayLong.mp3', 'music/bad.mp3', 'music/bizarreLoveTriangle.mp3', 'music/danceAway.mp3', 'music/EMC2.mp3', 'music/fastCar.mp3', 'music/feelAlright.mp3', 'music/liftMeUp.mp3', 'music/nothingToFear.mp3', 'music/ourHouse.mp3', 'music/oxygene.mp3', 'music/ruleTheWorld.mp3', 'music/soonYoullGetBetter.mp3', 'music/spaceOddity.mp3', 'music/sweetDreams.mp3', 'music/takeOnMe.mp3', 'music/thereMightBeCoffee.m4a', 'music/westEndGirls.mp3'];

const getTitle = (path) =>
  path
    .replace(/^.*\//, '')
    .replace(/\.[^.]+$/, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/^./, (c) => c.toUpperCase());

const formatTime = (s) => {
  if (!isFinite(s)) return '0:00';
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
};

export default function Music() {
  const [index, setIndex] = React.useState(0);
  const [playing, setPlaying] = React.useState(false);
  const [time, setTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [showList, setShowList] = React.useState(false);

  const audioRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const analyserRef = React.useRef(null);
  const ctxRef = React.useRef(null);
  const wantPlayRef = React.useRef(true);

  if (!audioRef.current) {
    audioRef.current = new Audio(mp3Files[0]);
  }
  const audio = audioRef.current;

  const ensureAnalyser = () => {
    if (analyserRef.current) {
      if (ctxRef.current.state === 'suspended') ctxRef.current.resume();
      return;
    }
    const AC = window.AudioContext || window.webkitAudioContext;
    const ctx = new AC();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 1024;
    analyser.smoothingTimeConstant = 0.8;
    ctx.createMediaElementSource(audio).connect(analyser);
    analyser.connect(ctx.destination);
    ctxRef.current = ctx;
    analyserRef.current = analyser;
  };

  const play = () => {
    ensureAnalyser();
    audio.play().catch(() => setPlaying(false));
  };

  const goTo = (i) => {
    const next = (i + mp3Files.length) % mp3Files.length;
    setIndex(next);
    audio.src = mp3Files[next];
    if (wantPlayRef.current) play();
  };

  const stateRef = React.useRef();
  stateRef.current = { index, goTo };

  React.useEffect(() => {
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onTime = () => setTime(audio.currentTime);
    const onMeta = () => setDuration(audio.duration);
    const onEnd = () => stateRef.current.goTo(stateRef.current.index + 1);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('ended', onEnd);
    audio.play().catch(() => {});
    return () => {
      audio.pause();
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('ended', onEnd);
    };
  }, []);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const g = canvas.getContext('2d');
    let raf;
    let phase = 0;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      raf = requestAnimationFrame(draw);
      const w = canvas.width;
      const h = canvas.height;
      g.clearRect(0, 0, w, h);

      const analyser = analyserRef.current;
      let wave = null;
      let freq = null;
      if (analyser) {
        wave = new Uint8Array(analyser.fftSize);
        freq = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteTimeDomainData(wave);
        analyser.getByteFrequencyData(freq);
      }

      // Overall energy drives amplitude of the layered waves.
      let energy = 0;
      if (freq) {
        for (let i = 0; i < 64; i++) energy += freq[i];
        energy /= 64 * 255;
      }
      phase += 0.02 + energy * 0.08;

      if (freq) {
        const bars = 64;
        const bw = w / bars;
        for (let i = 0; i < bars; i++) {
          const v = freq[Math.floor((i / bars) * 200)] / 255;
          const bh = v * h * 0.45;
          g.fillStyle = `hsla(${200 + i * 2}, 90%, 60%, 0.25)`;
          g.fillRect(i * bw + 1, h - bh, bw - 2, bh);
        }
      }

      const layers = 4;
      for (let l = 0; l < layers; l++) {
        g.beginPath();
        const amp = h * (0.06 + energy * 0.28) * (1 - l * 0.18);
        for (let x = 0; x <= w; x += 4) {
          const t = x / w;
          const sample = wave ? (wave[Math.floor(t * (wave.length - 1))] - 128) / 128 : 0;
          const envelope = Math.sin(t * Math.PI);
          const y = h / 2 + Math.sin(t * 6 + phase * (1 + l * 0.4) + l) * amp * envelope + sample * h * 0.3 * envelope * (1 - l * 0.2);
          x === 0 ? g.moveTo(x, y) : g.lineTo(x, y);
        }
        g.lineWidth = (3 - l * 0.5) * (window.devicePixelRatio || 1);
        g.strokeStyle = `hsla(${190 + l * 40 + ((phase * 10) % 60)}, 95%, 65%, ${0.9 - l * 0.2})`;
        g.shadowColor = g.strokeStyle;
        g.shadowBlur = 12;
        g.stroke();
      }
      g.shadowBlur = 0;
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const togglePlay = () => {
    if (audio.paused) {
      wantPlayRef.current = true;
      play();
    } else {
      wantPlayRef.current = false;
      audio.pause();
    }
  };

  const seek = (e) => {
    const t = Number(e.target.value);
    audio.currentTime = t;
    setTime(t);
  };

  const pct = duration ? (time / duration) * 100 : 0;

  return (
    <div className="player">
      <canvas ref={canvasRef} className="wave" />

      <div className="info">
        <div className="track-count">
          {index + 1} / {mp3Files.length}
        </div>
        <div className="title">{getTitle(mp3Files[index])}</div>
      </div>

      <div className="progress">
        <span>{formatTime(time)}</span>
        <input type="range" min="0" max={duration || 0} step="0.1" value={time} onChange={seek} style={{ '--pct': `${pct}%` }} />
        <span>{formatTime(duration)}</span>
      </div>

      <div className="controls">
        <button onClick={() => goTo(index - 1)} aria-label="Previous">
          ⏮
        </button>
        <button className="main" onClick={togglePlay} aria-label={playing ? 'Pause' : 'Play'}>
          {playing ? '⏸' : '▶'}
        </button>
        <button onClick={() => goTo(index + 1)} aria-label="Next">
          ⏭
        </button>
        <button className={showList ? 'active' : ''} onClick={() => setShowList(!showList)} aria-label="Playlist">
          ☰
        </button>
      </div>

      {showList && (
        <ul className="playlist">
          {mp3Files.map((f, i) => (
            <li
              key={f}
              className={i === index ? 'current' : ''}
              onClick={() => {
                goTo(i);
                setShowList(false);
              }}
            >
              <span className="num">{i + 1}</span>
              {getTitle(f)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
