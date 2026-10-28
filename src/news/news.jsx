import React from 'react';
import './news.css';

const API = 'https://hacker-news.firebaseio.com/v0';
const COUNT = 6;
const REFRESH_MS = 5 * 60 * 1000;

const getHost = (url) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return 'news.ycombinator.com';
  }
};

export default function News({ onClick }) {
  onClick = onClick || (() => {});
  const [stories, setStories] = React.useState([]);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const ids = await fetch(`${API}/topstories.json`).then((r) => r.json());
        const items = await Promise.all(ids.slice(0, COUNT).map((id) => fetch(`${API}/item/${id}.json`).then((r) => r.json())));
        if (!cancelled) {
          setStories(items.filter((s) => s && s.title));
          setError(false);
        }
      } catch {
        if (!cancelled) setError(true);
      }
    }

    load();
    const timer = setInterval(load, REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="news" onClick={onClick}>
      <div className="news-panel">
        <div className="news-header">
          <span className="news-live" />
          Tech Headlines
        </div>
        {error && stories.length === 0 && <div className="news-status">Unable to load headlines</div>}
        {!error && stories.length === 0 && <div className="news-status">Loading...</div>}
        <ol className="news-list">
          {stories.map((s, i) => (
            <li key={s.id} className="news-item" style={{ '--i': i }}>
              <a className="news-link" href={s.url || `https://news.ycombinator.com/item?id=${s.id}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                <span className="news-rank">{i + 1}</span>
                <div className="news-body">
                  <div className="news-title">{s.title}</div>
                  <div className="news-meta">
                    {getHost(s.url)} · {s.score} points
                  </div>
                </div>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
