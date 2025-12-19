class Lector {
  constructor(selector, options = {}) {
    // Options par défaut
    this.defaults = {
      width: '100%',
      height: 'auto',
      theme: 'default',
      hideControlsTimeout: 3000, // Délai avant masquage des contrôles (en ms)
      seekStep: 10, // Nombre de secondes pour l'avance/retour rapide
      colors: {
        primary: '#2196F3',
        secondary: '#FF4081',
        text: '#ffffff',
        background: '#1a1a1a'
      },
      controls: {
        playPause: true,
        progress: true,
        volume: true,
        fullscreen: true,
        time: true,
        speed: true
      },
      autoplay: false,
      loop: false,
      muted: false,
      preload: 'metadata',
      poster: ''
    };
    
    // Variables d'état
    this.isControlsVisible = true;
    this.controlsTimeout = null;

    // Fusion des options
    this.options = { ...this.defaults, ...options };
    
    // Initialisation
    this.container = document.querySelector(selector);
    if (!this.container) {
      console.error(`LectorJS: Aucun élément trouvé avec le sélecteur "${selector}"`);
      return;
    }

    this.init();
  }

  init() {
    // Création de l'interface
    this.createPlayer();
    this.setupEventListeners();
    this.applyTheme();
    
    // Démarrer le minuteur de masquage des contrôles
    this.startHideControlsTimer();
  }

  createPlayer() {
    // Création du conteneur principal
    this.player = document.createElement('div');
    this.player.className = 'lector-player';
    this.player.style.width = this.options.width;
    this.player.style.height = this.options.height;
    this.player.style.backgroundColor = this.options.colors.background;
    this.player.style.position = 'relative';
    this.player.style.overflow = 'hidden';
    this.player.style.borderRadius = '8px';
    this.player.style.userSelect = 'none';
    this.player.style.touchAction = 'manipulation';

    // Création de la vidéo
    this.video = document.createElement('video');
    this.video.className = 'lector-video';
    this.video.style.width = '100%';
    this.video.style.display = 'block';
    this.video.preload = this.options.preload;
    this.video.loop = this.options.loop;
    this.video.muted = this.options.muted;
    
    if (this.options.poster) {
      this.video.poster = this.options.poster;
    }

    // Création des contrôles
    this.controls = document.createElement('div');
    this.controls.className = 'lector-controls';
    this.controls.style.position = 'absolute';
    this.controls.style.bottom = '0';
    this.controls.style.left = '0';
    this.controls.style.right = '0';
    this.controls.style.padding = '10px';
    this.controls.style.background = 'linear-gradient(transparent, rgba(0,0,0,0.7))';
    this.controls.style.zIndex = '10';

    // Barre de progression
    if (this.options.controls.progress) {
      const progressContainer = document.createElement('div');
      progressContainer.className = 'lector-progress-container';
      progressContainer.style.height = '4px';
      progressContainer.style.backgroundColor = 'rgba(255,255,255,0.2)';
      progressContainer.style.borderRadius = '2px';
      progressContainer.style.marginBottom = '10px';
      progressContainer.style.cursor = 'pointer';
      progressContainer.style.position = 'relative';
      progressContainer.style.overflow = 'hidden';

      this.progress = document.createElement('div');
      this.progress.className = 'lector-progress';
      this.progress.style.height = '100%';
      this.progress.style.width = '0%';
      this.progress.style.backgroundColor = this.options.colors.primary;
      this.progress.style.transition = 'width 0.1s';

      progressContainer.appendChild(this.progress);
      controls.appendChild(progressContainer);
    }

    // Contrôles principaux
    const mainControls = document.createElement('div');
    mainControls.className = 'lector-main-controls';
    mainControls.style.display = 'flex';
    mainControls.style.alignItems = 'center';
    mainControls.style.justifyContent = 'space-between';

    // Groupe de contrôles de gauche
    const leftControls = document.createElement('div');
    leftControls.className = 'lector-left-controls';
    leftControls.style.display = 'flex';
    leftControls.style.alignItems = 'center';
    leftControls.style.gap = '10px';

    // Icônes SVG
    const icons = {
      play: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>',
      pause: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>',
      volume: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon></svg>',
      volumeMute: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>',
      fullscreen: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>',
      fullscreenExit: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path></svg>'
    };

    // Bouton lecture/pause
    if (this.options.controls.playPause) {
      this.playPauseBtn = document.createElement('button');
      this.playPauseBtn.className = 'lector-play-pause';
      this.playPauseBtn.innerHTML = icons.play;
      this.playPauseBtn.style.background = 'none';
      this.playPauseBtn.style.border = 'none';
      this.playPauseBtn.style.color = this.options.colors.text;
      this.playPauseBtn.style.width = '32px';
      this.playPauseBtn.style.height = '32px';
      this.playPauseBtn.style.display = 'flex';
      this.playPauseBtn.style.alignItems = 'center';
      this.playPauseBtn.style.justifyContent = 'center';
      this.playPauseBtn.style.borderRadius = '4px';
      this.playPauseBtn.style.transition = 'background-color 0.2s';
      this.playPauseBtn.style.cursor = 'pointer';
      
      this.playPauseBtn.addEventListener('mouseenter', () => {
        this.playPauseBtn.style.backgroundColor = 'rgba(255,255,255,0.1)';
      });
      
      leftControls.appendChild(this.playPauseBtn);
    }

    // Affichage du temps
    if (this.options.controls.time) {
      this.timeDisplay = document.createElement('div');
      this.timeDisplay.className = 'lector-time';
      this.timeDisplay.style.color = this.options.colors.text;
      this.timeDisplay.style.fontSize = '14px';
      this.timeDisplay.style.fontFamily = 'Arial, sans-serif';
      this.timeDisplay.textContent = '0:00 / 0:00';
      leftControls.appendChild(this.timeDisplay);
    }

    // Groupe de contrôles de droite
    const rightControls = document.createElement('div');
    rightControls.className = 'lector-right-controls';
    rightControls.style.display = 'flex';
    rightControls.style.alignItems = 'center';
    rightControls.style.gap = '10px';

    // Contrôle de volume
    if (this.options.controls.volume) {
      const volumeContainer = document.createElement('div');
      volumeContainer.className = 'lector-volume-container';
      volumeContainer.style.display = 'flex';
      volumeContainer.style.alignItems = 'center';
      volumeContainer.style.gap = '5px';

      this.volumeBtn = document.createElement('button');
      this.volumeBtn.className = 'lector-volume-btn';
      this.volumeBtn.innerHTML = icons.volume;
      this.volumeBtn.style.background = 'none';
      this.volumeBtn.style.border = 'none';
      this.volumeBtn.style.color = this.options.colors.text;
      this.volumeBtn.style.fontSize = '16px';
      this.volumeBtn.style.cursor = 'pointer';
      this.volumeBtn.style.padding = '5px';
      this.volumeBtn.style.borderRadius = '4px';
      this.volumeBtn.style.display = 'flex';
      this.volumeBtn.style.alignItems = 'center';
      this.volumeBtn.style.justifyContent = 'center';
      this.volumeBtn.style.transition = 'background-color 0.2s';

      this.volumeSlider = document.createElement('input');
      this.volumeSlider.type = 'range';
      this.volumeSlider.className = 'lector-volume-slider';
      this.volumeSlider.min = '0';
      this.volumeSlider.max = '1';
      this.volumeSlider.step = '0.01';
      this.volumeSlider.value = this.video.volume;
      this.volumeSlider.style.width = '60px';
      this.volumeSlider.style.height = '4px';
      this.volumeSlider.style.webkitAppearance = 'none';
      this.volumeSlider.style.background = this.options.colors.primary;
      this.volumeSlider.style.borderRadius = '2px';
      this.volumeSlider.style.outline = 'none';
      this.volumeSlider.style.opacity = '0.7';
      this.volumeSlider.style.transition = 'opacity 0.2s';

      volumeContainer.appendChild(this.volumeBtn);
      volumeContainer.appendChild(this.volumeSlider);
      rightControls.appendChild(volumeContainer);
    }

    // Bouton plein écran
    if (this.options.controls.fullscreen) {
      this.fullscreenBtn = document.createElement('button');
      this.fullscreenBtn.className = 'lector-fullscreen';
      this.fullscreenBtn.innerHTML = icons.fullscreen;
      this.fullscreenBtn.style.background = 'none';
      this.fullscreenBtn.style.border = 'none';
      this.fullscreenBtn.style.color = this.options.colors.text;
      this.fullscreenBtn.style.width = '32px';
      this.fullscreenBtn.style.height = '32px';
      this.fullscreenBtn.style.display = 'flex';
      this.fullscreenBtn.style.alignItems = 'center';
      this.fullscreenBtn.style.justifyContent = 'center';
      this.fullscreenBtn.style.borderRadius = '4px';
      this.fullscreenBtn.style.transition = 'all 0.2s';
      this.fullscreenBtn.style.cursor = 'pointer';

      rightControls.appendChild(this.fullscreenBtn);
    }

    // Assemblage des contrôles
    mainControls.appendChild(leftControls);
    mainControls.appendChild(rightControls);
    this.controls.appendChild(mainControls);

    // Ajout des éléments au lecteur
    this.player.appendChild(this.video);
    this.player.appendChild(this.controls);

    // Remplacement du conteneur original par le lecteur
    this.container.innerHTML = '';
    this.container.appendChild(this.player);
  }

  // Gestion du minuteur de masquage des contrôles
  startHideControlsTimer() {
    if (this.controlsTimeout) {
      clearTimeout(this.controlsTimeout);
    }
    
    this.controlsTimeout = setTimeout(() => {
      this.hideControls();
    }, this.options.hideControlsTimeout);
  }
  
  resetHideControlsTimer() {
    this.showControls();
    this.startHideControlsTimer();
  }
  
  showControls() {
    if (!this.isControlsVisible) {
      this.controls.style.opacity = '1';
      this.controls.style.pointerEvents = 'auto';
      this.isControlsVisible = true;
    }
  }
  
  hideControls() {
    if (this.isControlsVisible && !this.video.paused) {
      this.controls.style.opacity = '0';
      this.controls.style.pointerEvents = 'none';
      this.isControlsVisible = false;
    }
  }
  
  // Gestion de la navigation au clavier
  handleKeyDown(e) {
    const key = e.key.toLowerCase();
    
    switch(key) {
      case ' ':
      case 'k':
        e.preventDefault();
        this.togglePlay();
        this.resetHideControlsTimer();
        break;
      case 'm':
        this.toggleMute();
        this.resetHideControlsTimer();
        break;
      case 'f':
        this.toggleFullscreen();
        this.resetHideControlsTimer();
        break;
      case 'arrowleft':
        e.preventDefault();
        this.seekRelative(-this.options.seekStep);
        this.showSeekFeedback(-this.options.seekStep);
        this.resetHideControlsTimer();
        break;
      case 'arrowright':
        e.preventDefault();
        this.seekRelative(this.options.seekStep);
        this.showSeekFeedback(this.options.seekStep);
        this.resetHideControlsTimer();
        break;
      case 'arrowup':
        e.preventDefault();
        this.setVolume(Math.min(1, this.video.volume + 0.1));
        this.resetHideControlsTimer();
        break;
      case 'arrowdown':
        e.preventDefault();
        this.setVolume(Math.max(0, this.video.volume - 0.1));
        this.resetHideControlsTimer();
        break;
      case '0':
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
        const percent = parseInt(key) / 10;
        this.video.currentTime = this.video.duration * percent;
        this.resetHideControlsTimer();
        break;
    }
  }
  
  // Affiche un retour visuel lors du défilement
  showSeekFeedback(seconds) {
    const feedback = document.createElement('div');
    feedback.className = 'lector-seek-feedback';
    feedback.textContent = (seconds > 0 ? '+' : '') + seconds + 's';
    feedback.style.position = 'absolute';
    feedback.style.top = '50%';
    feedback.style.left = '50%';
    feedback.style.transform = 'translate(-50%, -50%)';
    feedback.style.background = 'rgba(0, 0, 0, 0.7)';
    feedback.style.color = 'white';
    feedback.style.padding = '10px 20px';
    feedback.style.borderRadius = '20px';
    feedback.style.fontSize = '24px';
    feedback.style.fontWeight = 'bold';
    feedback.style.pointerEvents = 'none';
    feedback.style.zIndex = '100';
    feedback.style.transition = 'opacity 0.5s';
    
    this.player.appendChild(feedback);
    
    // Animation
    setTimeout(() => {
      feedback.style.opacity = '0';
      setTimeout(() => {
        if (feedback.parentNode) {
          feedback.remove();
        }
      }, 500);
    }, 1000);
  }
  
  // Avance/recule la vidéo d'un certain nombre de secondes
  seekRelative(seconds) {
    this.video.currentTime = Math.max(0, Math.min(this.video.currentTime + seconds, this.video.duration));
  }
  
  setupEventListeners() {
    // Événements de la vidéo
    this.video.addEventListener('timeupdate', this.updateProgress.bind(this));
    this.video.addEventListener('loadedmetadata', this.updateTimeDisplay.bind(this));
    this.video.addEventListener('click', this.togglePlay.bind(this));
    this.video.addEventListener('play', this.onPlay.bind(this));
    this.video.addEventListener('pause', this.onPause.bind(this));
    this.video.addEventListener('volumechange', this.onVolumeChange.bind(this));
    
    // Détection de l'inactivité
    this.player.addEventListener('mousemove', this.resetHideControlsTimer.bind(this));
    this.player.addEventListener('mouseenter', this.showControls.bind(this));
    this.player.addEventListener('mouseleave', () => {
      if (!this.video.paused) {
        this.hideControls();
      }
    });
    
    // Navigation au clavier
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    
    // Événements tactiles
    let touchStartX = 0;
    let touchStartTime = 0;
    
    this.player.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartTime = Date.now();
      this.showControls();
    });
    
    this.player.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndTime = Date.now();
      const deltaX = touchEndX - touchStartX;
      const deltaTime = touchEndTime - touchStartTime;
      
      // Balayage rapide pour avancer/reculer
      if (Math.abs(deltaX) > 50 && deltaTime < 300) {
        const seconds = deltaX > 0 ? this.options.seekStep : -this.options.seekStep;
        this.seekRelative(seconds);
        this.showSeekFeedback(seconds);
      }
    });

    // Contrôles
    if (this.playPauseBtn) {
      this.playPauseBtn.addEventListener('click', this.togglePlay.bind(this));
    }

    if (this.progress) {
      const progressContainer = this.progress.parentElement;
      progressContainer.addEventListener('click', this.seek.bind(this));
    }

    if (this.volumeBtn) {
      this.volumeBtn.addEventListener('click', this.toggleMute.bind(this));
    }

    if (this.volumeSlider) {
      this.volumeSlider.addEventListener('input', this.setVolume.bind(this));
    }

    if (this.fullscreenBtn) {
      this.fullscreenBtn.addEventListener('click', this.toggleFullscreen.bind(this));
    }
  }

  // Méthodes de contrôle
  play() {
    this.video.play();
  }

  pause() {
    this.video.pause();
  }

  togglePlay() {
    if (this.video.paused) {
      this.play();
      this.startHideControlsTimer();
    } else {
      this.pause();
      this.showControls();
    }
  }

  onPlay() {
    if (this.playPauseBtn) {
      this.playPauseBtn.innerHTML = this.icons.pause;
    }
  }

  onPause() {
    if (this.playPauseBtn) {
      this.playPauseBtn.innerHTML = this.icons.play;
    }
  }

  updateProgress() {
    if (!this.progress) return;
    const percent = (this.video.currentTime / this.video.duration) * 100;
    this.progress.style.width = `${percent}%`;
    this.updateTimeDisplay();
  }

  updateTimeDisplay() {
    if (!this.timeDisplay) return;
    
    const formatTime = (seconds) => {
      const minutes = Math.floor(seconds / 60);
      seconds = Math.floor(seconds % 60);
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    this.timeDisplay.textContent = `${formatTime(this.video.currentTime)} / ${formatTime(this.video.duration || 0)}`;
  }

  seek(e) {
    if (!this.progress) return;
    const rect = this.progress.parentElement.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    this.video.currentTime = pos * this.video.duration;
    this.resetHideControlsTimer();
  }

  setVolume() {
    if (!this.volumeSlider) return;
    this.video.volume = this.volumeSlider.value;
    this.updateVolumeIcon();
  }

  toggleMute() {
    this.video.muted = !this.video.muted;
    if (this.volumeSlider) {
      this.volumeSlider.value = this.video.muted ? 0 : this.video.volume;
    }
    this.updateVolumeIcon();
  }

  onVolumeChange() {
    if (this.volumeSlider) {
      this.volumeSlider.value = this.video.muted ? 0 : this.video.volume;
    }
    this.updateVolumeIcon();
  }

  updateVolumeIcon() {
    if (!this.volumeBtn) return;
    
    if (this.video.muted || this.video.volume === 0) {
      this.volumeBtn.innerHTML = this.icons.volumeMute;
    } else {
      this.volumeBtn.innerHTML = this.icons.volume;
    }
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      this.player.requestFullscreen().then(() => {
        this.fullscreenBtn.innerHTML = this.icons.fullscreenExit;
      }).catch(err => {
        console.error(`Erreur lors du passage en plein écran: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          this.fullscreenBtn.innerHTML = this.icons.fullscreen;
        });
      }
    }
  }

  applyTheme() {
    // Application des couleurs personnalisées
    const style = document.createElement('style');
    style.textContent = `
      .lector-player video::-webkit-media-controls {
        display: none !important;
      }
      
      .lector-player video::-webkit-media-controls-enclosure {
        display: none !important;
      }
      
      .lector-controls {
        transition: opacity 0.3s ease-out;
        opacity: 1;
      }
      
      .lector-controls.hidden {
        opacity: 0;
        pointer-events: none;
      }
      
      .lector-progress-container {
        transition: height 0.2s ease;
      }
      
      .lector-progress-container:hover .lector-progress {
        height: 6px;
      }
      
      .lector-volume-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: ${this.options.colors.text};
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.2s;
      }
      
      .lector-volume-container:hover .lector-volume-slider::-webkit-slider-thumb {
        opacity: 1;
      }
      
      .lector-volume-slider::-moz-range-thumb {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: ${this.options.colors.text};
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.2s;
      }
      
      .lector-volume-container:hover .lector-volume-slider::-moz-range-thumb {
        opacity: 1;
      }
      
      button {
        transition: background-color 0.2s, transform 0.1s;
      }
      
      button:active {
        transform: scale(0.95);
      }
      
      button:hover {
        background-color: rgba(255, 255, 255, 0.1) !important;
      }
      
      .lector-volume-slider {
        transition: opacity 0.3s;
      }
      
      .lector-volume-slider:hover {
        opacity: 1 !important;
      }
      
      @media (max-width: 600px) {
        .lector-controls {
          padding: 5px !important;
        }
        
        .lector-time {
          font-size: 12px !important;
        }
        
        button {
          padding: 2px !important;
          min-width: 28px !important;
          height: 28px !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Méthodes publiques
  setSource(src) {
    this.video.src = src;
    return this;
  }

  setPoster(poster) {
    this.video.poster = poster;
    return this;
  }

  setAutoplay(autoplay) {
    this.video.autoplay = autoplay;
    return this;
  }

  setLoop(loop) {
    this.video.loop = loop;
    return this;
  }

  setMuted(muted) {
    this.video.muted = muted;
    if (this.volumeSlider) {
      this.volumeSlider.value = muted ? 0 : this.video.volume;
    }
    this.updateVolumeIcon();
    return this;
  }

  setVolume(volume) {
    if (typeof volume === 'number' && volume >= 0 && volume <= 1) {
      this.video.volume = volume;
      this.video.muted = false;
      if (this.volumeSlider) {
        this.volumeSlider.value = volume;
      }
      this.updateVolumeIcon();
    }
    return this;
  }

  // Méthodes statiques pour une utilisation plus simple
  static init(selector, options = {}) {
    return new Lector(selector, options);
  }
}

// Export pour les modules ES6
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = Lector;
} else {
  // Export pour le navigateur
  window.Lector = Lector;
}
