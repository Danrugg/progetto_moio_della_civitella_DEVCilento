document.addEventListener("DOMContentLoaded", () => {
    
    const params = new URLSearchParams(window.location.search);
    const tappaId = params.get('tappa') || "1";

    const datiTappa = typeof tourData !== 'undefined' ? tourData[tappaId] : null;

    if (datiTappa) {
        // --- SPLASH SCREEN ---
        document.getElementById('splash-titolo').innerText = datiTappa.titolo;
        
        // CORREZIONE: Impostiamo di nuovo l'immagine come sfondo della sezione!
        document.getElementById('splash-screen').style.backgroundImage = `url('${datiTappa.immagine_intro}')`;

        // --- CONTENUTI ---
        document.getElementById('content-screen').style.backgroundImage = `url('${datiTappa.immagine_content}')`;
        document.getElementById('storia-testo').innerHTML = datiTappa.storia;
        document.getElementById('mappa-img').src = datiTappa.mappa;
        document.getElementById('audio-player').src = datiTappa.audio;

        const carousel = document.getElementById('carousel');
        carousel.innerHTML = ''; // Pulisce eventuali foto vecchie per sicurezza
        
        datiTappa.immagini.forEach(imgSrc => {
            let imgElement = document.createElement('img');
            imgElement.src = imgSrc;
            imgElement.className = 'carousel-img';
            imgElement.loading = 'lazy';
            carousel.appendChild(imgElement);
        });

    } else {
        document.getElementById('splash-titolo').innerText = "Tappa non trovata";
        const btnEntra = document.getElementById('btn-entra');
        if (btnEntra) btnEntra.style.display = 'none';
    }

    const btnEntra = document.getElementById('btn-entra');
    if (btnEntra) {
        btnEntra.addEventListener('click', () => {
            document.getElementById('splash-screen').classList.add('hidden');
            document.getElementById('content-screen').classList.remove('hidden');
            window.scrollTo(0, 0);
        });
    }
    // --- LOGICA PLAYER AUDIO PERSONALIZZATO ---
    const audioPlayer = document.getElementById('audio-player');
    const playBtn = document.getElementById('play-btn');
    const seekBar = document.getElementById('seek-bar');
    const currentTimeText = document.getElementById('current-time');
    const durationText = document.getElementById('duration');

    if (audioPlayer && playBtn) {
        // Funzione per formattare i secondi in M:SS
        const formatTime = (time) => {
            if (isNaN(time)) return "0:00";
            const minutes = Math.floor(time / 60);
            const seconds = Math.floor(time % 60).toString().padStart(2, '0');
            return `${minutes}:${seconds}`;
        };

        // Quando l'audio è pronto, imposta la durata
        audioPlayer.addEventListener('loadedmetadata', () => {
            seekBar.max = audioPlayer.duration;
            durationText.innerText = formatTime(audioPlayer.duration);
        });

        const playSVG = `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
        const pauseSVG = `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;

        // Click sul tasto Play/Pausa
        playBtn.addEventListener('click', () => {
            if (audioPlayer.paused) {
                audioPlayer.play();
                playBtn.innerHTML = pauseSVG; // Mette le due stanghette perfette
            } else {
                audioPlayer.pause();
                playBtn.innerHTML = playSVG; // Rimette il triangolo
            }
        });

        // Aggiorna la barra e i numeri mentre l'audio suona
        audioPlayer.addEventListener('timeupdate', () => {
            seekBar.value = audioPlayer.currentTime;
            currentTimeText.innerText = formatTime(audioPlayer.currentTime);
        });

        // Sposta l'audio quando l'utente tocca la barra
        seekBar.addEventListener('input', () => {
            audioPlayer.currentTime = seekBar.value;
        });
    }
});