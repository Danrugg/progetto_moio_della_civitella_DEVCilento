document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const monumentId = urlParams.get('p');
  
    // Gestione sfondo dinamico in base al parametro ?p=
    if (!monumentId || monumentId.trim() === '') {
        document.body.classList.add('bg-splash');
        document.body.classList.remove('bg-monument');
    } else {
        document.body.classList.add('bg-monument');
        document.body.classList.remove('bg-splash');
    }

    const splashScreen = document.getElementById('splash-screen');
    const mainContent = document.getElementById('main-content');
    const btnEntra = document.getElementById('btn-entra');
    const errorMessage = document.getElementById('error-message');
  
    // Funzione per il recupero dei dati json
    async function loadData() {
      try {
        const response = await fetch('dati.json');
        if (!response.ok) throw new Error('Risposta rete non valida');
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Errore nel caricamento dei dati:', error);
        return [];
      }
    }
  
    // Inizializzazione applicazione
    async function init() {
      const data = await loadData();
      
      if (monumentId) {
        const monument = data.find(item => item.id === monumentId);
        if (monument) {
          renderMonument(monument);
          splashScreen.classList.add('hidden');
          mainContent.classList.add('visible');
        } else {
          splashScreen.classList.remove('hidden');
        }
      } else {
        splashScreen.classList.remove('hidden');
      }
    }
  
    // Creazione dinamica della scheda del monumento
    function renderMonument(data) {
      // 1. Carosello Immagini
      if (data.immagini && data.immagini.length > 0) {
        const carouselStr = data.immagini.map(img => `<img src="${img}" class="carousel-img" alt="${data.titolo}">`).join('');
        document.getElementById('carousel').innerHTML = carouselStr;
        
        const dotsStr = data.immagini.map((_, i) => `<div class="dot ${i === 0 ? 'active' : ''}"></div>`).join('');
        document.getElementById('carousel-dots').innerHTML = dotsStr;
        
        setupCarouselScroll();
      }
  
      // 2. Lettore Audio
      document.getElementById('audio-title').textContent = data.titolo;
      const audioPlayer = document.getElementById('audio-player');
      if (data.audio_url) {
        audioPlayer.src = data.audio_url;
        setupAudioPlayer(audioPlayer);
      } else {
        document.querySelector('.audio-player-container').style.display = 'none';
      }
  
      // 3. Testo del monumento (Titolo, Sottotitolo e Descrizione)
      document.getElementById('monument-title').textContent = data.titolo || '';
      document.getElementById('monument-subtitle').textContent = data.sottotitolo || '';
      document.getElementById('monument-description').innerHTML = data.descrizione || '';
  
      // 4. Mappa
      if (data.mappa_url) {
        const mapImg = document.getElementById('map-img');
        const modalImg = document.getElementById('modal-map-img');
        mapImg.src = data.mappa_url;
        modalImg.src = data.mappa_url;
        setupMapModal();
      } else {
        document.getElementById('map-section').style.display = 'none';
      }
    }
  
    // Logica di scorrimento del Carosello
    function setupCarouselScroll() {
      const carousel = document.getElementById('carousel');
      const dots = document.querySelectorAll('.dot');
      
      carousel.addEventListener('scroll', () => {
        const scrollLeft = carousel.scrollLeft;
        const index = Math.round(scrollLeft / carousel.offsetWidth);
        
        dots.forEach((dot, i) => {
          if (i === index) {
            dot.classList.add('active');
          } else {
            dot.classList.remove('active');
          }
        });
      });
    }
  
    // Logica e controlli del Lettore Audio
    function setupAudioPlayer(audio) {
      const playBtn = document.getElementById('play-btn');
      const playIcon = document.getElementById('play-icon');
      const progressBar = document.getElementById('progress-bar');
      const currentTimeEl = document.getElementById('current-time');
      const durationEl = document.getElementById('duration');
  
      playIcon.innerHTML = '<path d="M8 5v14l11-7z"/>'; 
      progressBar.value = 0;
      currentTimeEl.textContent = '0:00';
      durationEl.textContent = '0:00';
  
      playBtn.addEventListener('click', () => {
        if (audio.paused) {
          audio.play();
          playIcon.innerHTML = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>'; 
        } else {
          audio.pause();
          playIcon.innerHTML = '<path d="M8 5v14l11-7z"/>'; 
        }
      });
  
      audio.addEventListener('loadedmetadata', () => {
        const duration = isNaN(audio.duration) || !isFinite(audio.duration) ? 0 : audio.duration;
        durationEl.textContent = formatTime(duration);
        progressBar.max = Math.floor(duration);
      });
  
      audio.addEventListener('timeupdate', () => {
        progressBar.value = Math.floor(audio.currentTime);
        currentTimeEl.textContent = formatTime(audio.currentTime);
      });
  
      progressBar.addEventListener('input', () => {
        audio.currentTime = progressBar.value;
      });
  
      audio.addEventListener('ended', () => {
        playIcon.innerHTML = '<path d="M8 5v14l11-7z"/>';
        progressBar.value = 0;
        currentTimeEl.textContent = '0:00';
      });
    }
  
    // Formattazione tempo in minuti:secondi
    function formatTime(seconds) {
      if (!seconds || isNaN(seconds)) return "0:00";
      const min = Math.floor(seconds / 60);
      const sec = Math.floor(seconds % 60);
      return `${min}:${sec.toString().padStart(2, '0')}`;
    }
  
    // Logica Modale Mappa
    let panzoomInstance = null;

    function setupMapModal() {
      const mapSection = document.getElementById('map-section');
      const mapModal = document.getElementById('map-modal');
      const closeModal = document.getElementById('modal-close');
      const modalImg = document.getElementById('modal-map-img');
  
      // Inizializza Panzoom per il pinch-to-zoom (se la libreria è caricata)
      if (typeof Panzoom !== 'undefined' && !panzoomInstance) {
        panzoomInstance = Panzoom(modalImg, {
          maxScale: 5,
          minScale: 1,
          contain: 'outside'
        });
        modalImg.parentElement.addEventListener('wheel', panzoomInstance.zoomWithWheel);
      }

      // Evita listener duplicati
      if (mapSection.dataset.listenerSetup) return;
      mapSection.dataset.listenerSetup = "true";

      mapSection.addEventListener('click', () => {
        mapModal.classList.add('active');
      });
  
      closeModal.addEventListener('click', () => {
        mapModal.classList.remove('active');
        if (panzoomInstance) panzoomInstance.reset();
      });
  
      mapModal.addEventListener('click', (e) => {
        if (e.target === mapModal) {
          mapModal.classList.remove('active');
          if (panzoomInstance) panzoomInstance.reset();
        }
      });
    }
  
    // Evento Bottone Schermata Iniziale (Splash)
    btnEntra.addEventListener('click', async () => {
      splashScreen.style.opacity = '0';
      
      setTimeout(async () => {
        splashScreen.classList.add('hidden');
        
        const data = await loadData();
        if (monumentId) {
            const monument = data.find(item => item.id === monumentId);
            if(monument) {
                document.body.classList.add('bg-monument');
                document.body.classList.remove('bg-splash');
                renderMonument(monument);
                mainContent.classList.add('visible');
            } else {
                // Caso di fallback quando l'id cercato non produce risultati ma esistono dati
                if (data && data.length > 0) {
                    document.body.classList.add('bg-monument');
                    document.body.classList.remove('bg-splash');
                    renderMonument(data[0]); 
                    mainContent.classList.add('visible');
                } else {
                    errorMessage.style.display = 'block';
                    mainContent.classList.add('visible');
                }
            }
        }
        else if (data && data.length > 0) {
          // Navigazione normale senza parametro porta al primo punto di interesse
          document.body.classList.add('bg-monument');
          document.body.classList.remove('bg-splash');
          renderMonument(data[0]); 
          mainContent.classList.add('visible');
        } else {
          errorMessage.style.display = 'block';
          mainContent.classList.add('visible');
        }
      }, 500); 
    });
  
    // Chiamata inizializzazione
    init();
});
