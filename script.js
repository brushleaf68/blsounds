const songs = [
  "songs/song1/meta.json",
  "songs/song2/meta.json"
];

const songList = document.getElementById("song-list");
const cover = document.getElementById("cover");
const title = document.getElementById("title");
const album = document.getElementById("album");
const audio = document.getElementById("audio");
const progress = document.getElementById("progress");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const search = document.getElementById("search");

let currentSong = null;

// Load songs
async function loadSongs() {
  for (let path of songs) {
    const res = await fetch(path);
    const meta = await res.json();
    const base = path.replace("meta.json", "");

    const bubble = document.createElement("div");
    bubble.className = "song-bubble";
    bubble.style.background = meta.color;
    bubble.innerHTML = `
      <img src="${base}cover.png" alt="cover">
      <div>
        <strong>${meta.name}</strong><br>
        <small>${meta.length} • ${meta.album}</small>
      </div>
    `;
    bubble.addEventListener("click", () => playSong(base, meta));
    songList.appendChild(bubble);
  }
}

function playSong(base, meta) {
  currentSong = meta;
  cover.src = base + "cover.png";
  title.textContent = meta.name;
  album.textContent = `${meta.album} • ${meta.date}`;
  audio.src = base + "track.mp3";
  audio.play();
}

// Progress bar update
audio.addEventListener("timeupdate", () => {
  if (audio.duration) {
    progress.max = audio.duration;
    progress.value = audio.currentTime;
    currentTimeEl.textContent = formatTime(audio.currentTime);
    durationEl.textContent = formatTime(audio.duration);
  }
});
progress.addEventListener("input", () => {
  audio.currentTime = progress.value;
});

function formatTime(sec) {
  let m = Math.floor(sec / 60);
  let s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// Search filter
search.addEventListener("input", e => {
  const term = e.target.value.toLowerCase();
  [...songList.children].forEach(bubble => {
    bubble.style.display = bubble.innerText.toLowerCase().includes(term)
      ? "flex" : "none";
  });
});

loadSongs();
