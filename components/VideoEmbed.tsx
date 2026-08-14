'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';
import styles from './VideoEmbed.module.css';

// Facade embed: show the thumbnail + play button, and only load the YouTube player (from the
// no-cookie domain) once the user clicks. Keeps the page fast and cookie-free until play.
export function VideoEmbed({ id, title }: { id: string; title: string }) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div className={styles.frame}>
        <iframe
          className={styles.media}
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className={styles.frame}>
      <button
        type="button"
        className={styles.facade}
        onClick={() => setPlaying(true)}
        aria-label={`Phát video: ${title}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- external YouTube thumbnail, not optimizable */}
        <img
          src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
          alt=""
          className={styles.thumb}
          loading="lazy"
        />
        <span className={styles.playButton}>
          <Play size={26} fill="currentColor" strokeWidth={0} />
        </span>
      </button>
    </div>
  );
}
