document.addEventListener('DOMContentLoaded', () => {
  const audio = document.getElementById('audio-player');
  const playBtn = document.getElementById('play-btn');
  const muteBtn = document.getElementById('mute-btn');
  const volSlider = document.getElementById('volume-slider');
  
  const iconPlay = document.getElementById('icon-play');
  const iconPause = document.getElementById('icon-pause');
  const iconVol = document.getElementById('icon-vol');
  const iconMute = document.getElementById('icon-mute');
  
  const coverArt = document.getElementById('cover-art');
  const noArt = document.getElementById('no-art');
  const songTitle = document.getElementById('song-title');
  const songArtist = document.getElementById('song-artist');
  const statusText = document.getElementById('status-text');

  let isPlaying = false;
  let isMuted = false;
  let currentVolume = 0.8;

  // Init audio
  audio.src = 'https://a13.asurahosting.com/listen/lunfm/radio.mp3';
  audio.volume = currentVolume;

  // Controls
  playBtn.addEventListener('click', () => {
    if (isPlaying) {
      audio.pause();
      isPlaying = false;
    } else {
      audio.play().catch(e => console.error("Play failed:", e));
      isPlaying = true;
    }
    updatePlayState();
  });

  muteBtn.addEventListener('click', () => {
    isMuted = !isMuted;
    audio.muted = isMuted;
    updateMuteState();
  });

  volSlider.addEventListener('input', (e) => {
    currentVolume = parseFloat(e.target.value);
    audio.volume = currentVolume;
    
    if (currentVolume === 0) {
      if (!isMuted) {
        isMuted = true;
        audio.muted = true;
        updateMuteState();
      }
    } else if (isMuted && currentVolume > 0) {
      isMuted = false;
      audio.muted = false;
      updateMuteState();
    }
  });

  function updatePlayState() {
    if (isPlaying) {
      iconPlay.classList.add('hidden');
      iconPause.classList.remove('hidden');
      coverArt.classList.add('scale-105');
      coverArt.classList.remove('grayscale');
    } else {
      iconPlay.classList.remove('hidden');
      iconPause.classList.add('hidden');
      coverArt.classList.remove('scale-105');
      coverArt.classList.add('grayscale');
    }
  }

  function updateMuteState() {
    if (isMuted) {
      iconVol.classList.add('hidden');
      iconMute.classList.remove('hidden');
    } else {
      iconVol.classList.remove('hidden');
      iconMute.classList.add('hidden');
    }
  }

  // Fetch Metadata
  async function fetchNowPlaying() {
    try {
      const res = await fetch('https://a13.asurahosting.com/api/nowplaying/lunfm');
      const data = await res.json();
      
      const song = data.now_playing.song;
      songTitle.textContent = song.title || 'Inconnu';
      songTitle.title = song.title || 'Inconnu';
      songArtist.textContent = song.artist || 'Inconnu';
      songArtist.title = song.artist || 'Inconnu';
      
      if (song.art) {
        coverArt.src = song.art;
        coverArt.style.display = 'block';
        noArt.style.display = 'none';
        const bgCover = document.getElementById('bgCover');
        if (bgCover) bgCover.style.backgroundImage = `url(${song.art})`;
      } else {
        coverArt.style.display = 'none';
        noArt.style.display = 'flex';
        const bgCover = document.getElementById('bgCover');
        if (bgCover) bgCover.style.backgroundImage = 'none';
      }

      statusText.textContent = data.live.is_live ? 'En direct' : 'La radio de l\'univers';
    } catch (err) {
      console.error('Failed to fetch metadata', err);
    }
  }

  fetchNowPlaying();
  setInterval(fetchNowPlaying, 10000);
});
