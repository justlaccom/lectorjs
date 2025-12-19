class Lector {
  constructor(selector, options = {}) {
    // Options par défaut
    this.defaults = {
      width: '100%',
      height: 'auto',
      theme: 'default',
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
    const controls = document.createElement('div');
    controls.className = 'lector-controls';
    controls.style.position = 'absolute';
    controls.style.bottom = '0';
    controls.style.left = '0';
    controls.style.right = '0';
    controls.style.padding = '10px';
    controls.style.background = 'linear-gradient(transparent, rgba(0,0,0,0.7))';
    controls.style.transition = 'opacity 0.3s';

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
    controls.appendChild(mainControls);

    // Ajout des éléments au lecteur
    this.player.appendChild(this.video);
    this.player.appendChild(controls);

    // Remplacement du conteneur original par le lecteur
    this.container.innerHTML = '';
    this.container.appendChild(this.player);
  }

  setupEventListeners() {
    // Événements de la vidéo
    this.video.addEventListener('timeupdate', this.updateProgress.bind(this));
    this.video.addEventListener('loadedmetadata', this.updateTimeDisplay.bind(this));
    this.video.addEventListener('click', this.togglePlay.bind(this));
    this.video.addEventListener('play', this.onPlay.bind(this));
    this.video.addEventListener('pause', this.onPause.bind(this));
    this.video.addEventListener('volumechange', this.onVolumeChange.bind(this));

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
    } else {
      this.pause();
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
      
      button:hover {
        background-color: rgba(255, 255, 255, 0.1) !important;
      }
      
      .lector-volume-slider:hover {
        opacity: 1 !important;
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
