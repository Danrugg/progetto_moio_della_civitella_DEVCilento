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
});