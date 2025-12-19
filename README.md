# LectorJS

Une bibliothèque JavaScript légère et personnalisable pour créer des lecteurs vidéo modernes et élégants pour le web.

## Fonctionnalités

- Interface utilisateur moderne et responsive
- Personnalisation complète des couleurs
- Contrôles personnalisables (lecture/pause, volume, plein écran, etc.)
- Barre de progression interactive
- Affichage du temps de lecture
- Mode plein écran
- Compatible avec tous les navigateurs modernes
- Léger et facile à intégrer

## Installation

### Via CDN (méthode la plus simple)

Ajoutez ceci à votre fichier HTML :

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/votre-compte/lectorjs/dist/lector.min.css">
<script src="https://cdn.jsdelivr.net/gh/votre-compte/lectorjs/dist/lector.min.js"></script>
```

### Installation via npm

```bash
npm install lectorjs --save
```

Puis importez-le dans votre projet :

```javascript
import Lector from 'lectorjs';
```

## Utilisation de base

### HTML

```html
<div id="my-video"></div>
```

### JavaScript

```javascript
// Initialisation avec les options par défaut
const player = new Lector('#my-video', {
    // Options de configuration
    width: '800px',
    height: '450px',
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
    poster: 'chemin/vers/votre-poster.jpg'
});

// Définir la source vidéo
player.setSource('chemin/vers/votre-video.mp4');

// Lecture automatique (si autorisé par le navigateur)
// player.setAutoplay(true);
```

## Options de configuration

| Option | Type | Défaut | Description |
|--------|------|---------|-------------|
| `width` | string | `'100%'` | Largeur du lecteur |
| `height` | string | `'auto'` | Hauteur du lecteur |
| `colors.primary` | string | `'#2196F3'` | Couleur principale (boutons, barre de progression) |
| `colors.secondary` | string | `'#FF4081'` | Couleur secondaire |
| `colors.text` | string | `'#ffffff'` | Couleur du texte |
| `colors.background` | string | `'#1a1a1a'` | Couleur de fond du lecteur |
| `controls.playPause` | boolean | `true` | Afficher le bouton lecture/pause |
| `controls.progress` | boolean | `true` | Afficher la barre de progression |
| `controls.volume` | boolean | `true` | Afficher le contrôle de volume |
| `controls.fullscreen` | boolean | `true` | Afficher le bouton plein écran |
| `controls.time` | boolean | `true` | Afficher le temps écoulé/restant |
| `controls.speed` | boolean | `true` | Afficher le contrôle de vitesse |
| `autoplay` | boolean | `false` | Lecture automatique |
| `loop` | boolean | `false` | Lecture en boucle |
| `muted` | boolean | `false` | Lecture en sourdine par défaut |
| `preload` | string | `'metadata'` | Préchargement de la vidéo (none, metadata, auto) |
| `poster` | string | `''` | URL de l'image d'aperçu |

## Méthodes disponibles

- `play()`: Lance la lecture de la vidéo
- `pause()`: Met la lecture en pause
- `togglePlay()`: Alterne entre lecture et pause
- `setVolume(volume)`: Définit le volume (entre 0 et 1)
- `toggleMute()`: Active/désactive le son
- `setSource(src)`: Définit la source vidéo
- `setPoster(poster)`: Définit l'image d'aperçu
- `setAutoplay(autoplay)`: Active/désactive la lecture automatique
- `setLoop(loop)`: Active/désactive la lecture en boucle
- `setMuted(muted)`: Active/désactive le mode silencieux

## Événements

Vous pouvez écouter les événements natifs de la balise `<video>` :

```javascript
const player = new Lector('#my-video');
const videoElement = player.video; // Accès à l'élément vidéo natif

videoElement.addEventListener('play', () => {
    console.log('La lecture a commencé');
});

videoElement.addEventListener('pause', () => {
    console.log('La lecture est en pause');
});

videoElement.addEventListener('ended', () => {
    console.log('La vidéo est terminée');
});
```

## Personnalisation

### Thèmes personnalisés

Vous pouvez facilement personnaliser l'apparence du lecteur en modifiant les couleurs :

```javascript
const player = new Lector('#my-video', {
    colors: {
        primary: '#FF5722',
        secondary: '#9C27B0',
        text: '#FFFFFF',
        background: '#263238'
    }
});
```

### CSS personnalisé

Vous pouvez également ajouter vos propres styles CSS en ciblant les classes du lecteur :

```css
.lector-player {
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.lector-controls {
    padding: 15px !important;
}
```

## Compatibilité

LectorJS est compatible avec tous les navigateurs modernes :
- Chrome (dernière version)
- Firefox (dernière version)
- Safari (dernière version)
- Edge (dernière version)
- Opera (dernière version)

## Licence

MIT
