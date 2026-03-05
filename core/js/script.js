// 1. SCRIPT PER IL LOOP DELLE FOTO
let fotoCorrente = 0;
const foto = document.querySelectorAll('.hero-image');

function cambiaFoto(direzione) {
    foto[fotoCorrente].classList.remove('active');
    fotoCorrente = fotoCorrente + direzione;
    if (fotoCorrente >= foto.length) { fotoCorrente = 0; } 
    else if (fotoCorrente < 0) { fotoCorrente = foto.length - 1; }
    foto[fotoCorrente].classList.add('active');
}

// 2. SCRIPT PER I PLAYER AUDIO CUSTOM
document.querySelectorAll('.audio-card').forEach(card => {
    const audio = card.querySelector('.real-audio');
    const playBtn = card.querySelector('.play-btn');
    const progressBar = card.querySelector('.progress-bar');
    const currentTimeEl = card.querySelector('.current-time');
    const durationTimeEl = card.querySelector('.duration-time');
    const speedBtn = card.querySelector('.speed-btn');

    function formatTime(seconds) {
        if (isNaN(seconds)) return "0:00";
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return min + ":" + (sec < 10 ? "0" : "") + sec;
    }

    playBtn.addEventListener('click', () => {
        document.querySelectorAll('.real-audio').forEach(otherAudio => {
            if (otherAudio !== audio) {
                otherAudio.pause();
                otherAudio.parentElement.querySelector('.play-btn').innerHTML = '▶';
            }
        });

        if (audio.paused) {
            audio.play();
            playBtn.innerHTML = '⏸';
        } else {
            audio.pause();
            playBtn.innerHTML = '▶';
        }
    });

    audio.addEventListener('timeupdate', () => {
        const percentuale = (audio.currentTime / audio.duration) * 100;
        progressBar.value = percentuale || 0;
        currentTimeEl.textContent = formatTime(audio.currentTime);
    });

    audio.addEventListener('loadedmetadata', () => {
        durationTimeEl.textContent = formatTime(audio.duration);
    });

    progressBar.addEventListener('input', () => {
        audio.currentTime = (progressBar.value / 100) * audio.duration;
    });

    const velocita = [1, 1.5, 2];
    let indiceVelocita = 0;
    
    speedBtn.addEventListener('click', () => {
        indiceVelocita = (indiceVelocita + 1) % velocita.length;
        audio.playbackRate = velocita[indiceVelocita];
        speedBtn.textContent = velocita[indiceVelocita] + 'x';
    });
    
    audio.addEventListener('ended', () => {
        playBtn.innerHTML = '▶';
        progressBar.value = 0;
        audio.currentTime = 0;
    });
});

// 3. GESTIONE SCHERMATA BENVENUTO E ACQUA
const waterSound = document.getElementById('waterSound');
const splashScreen = document.getElementById('splashScreen');
const enterBtn = document.getElementById('enterBtn');

waterSound.volume = 0.15; 

enterBtn.addEventListener('click', function() {
    waterSound.play();
    splashScreen.classList.add('splash-hidden');
});