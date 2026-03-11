document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Capire in quale tappa siamo (es. url.it/?tappa=3)
    const params = new URLSearchParams(window.location.search);
    const tappaId = params.get('tappa') || "1"; // Se non c'è, parte dalla 1

    // 2. Recuperare i dati dal file data.js (che creeremo dopo)
    // tourData è la variabile che metteremo in data.js
    const datiTappa = typeof tourData !== 'undefined' ? tourData[tappaId] : null;

    if (datiTappa) {
        // --- COMPILIAMO LA SPLASH SCREEN ---
        document.getElementById('splash-titolo').innerText = datiTappa.titolo;
        document.getElementById('splash-screen').style.backgroundImage = `url('${datiTappa.immagine_intro}')`;

        // --- COMPILIAMO I CONTENUTI ---
        
        // Testo e Mappa
        document.getElementById('storia-testo').innerHTML = datiTappa.storia;
        document.getElementById('mappa-img').src = datiTappa.mappa;
        
        // Audio
        document.getElementById('audio-player').src = datiTappa.audio;

        // Carousel Immagini (creiamo i tag <img> dinamicamente)
        const carousel = document.getElementById('carousel');
        datiTappa.immagini.forEach(imgSrc => {
            let imgElement = document.createElement('img');
            imgElement.src = imgSrc;
            imgElement.className = 'carousel-img';
            imgElement.loading = 'lazy'; // Fa caricare le foto solo quando servono
            carousel.appendChild(imgElement);
        });

    } else {
        // Se qualcuno scrive una tappa che non esiste
        document.getElementById('splash-titolo').innerText = "Tappa non trovata";
        document.getElementById('btn-entra').style.display = 'none';
    }

    // 3. Gestire il click sul bottone "ENTRA"
    document.getElementById('btn-entra').addEventListener('click', () => {
        document.getElementById('splash-screen').classList.add('hidden');
        document.getElementById('content-screen').classList.remove('hidden');
        window.scrollTo(0, 0); // Riporta la pagina in alto
    });

});