<div align="center">
  <h1>LectorJS</h1>
  <p>🎬 Une bibliothèque JavaScript légère et personnalisable pour créer des lecteurs vidéo modernes et élégants pour le web.</p>
  
  [![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/justlaccom/lectorjs)
  [![jsDelivr](https://data.jsdelivr.com/v1/package/gh/justlaccom/lectorjs/badge)](https://www.jsdelivr.com/package/gh/justlaccom/lectorjs)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black" alt="JavaScript">
</div>

## 🌟 Fonctionnalités

## Fonctionnalités

- Interface utilisateur moderne et responsive
- Personnalisation complète des couleurs
- Contrôles personnalisables (lecture/pause, volume, plein écran, etc.)
- Barre de progression interactive
- Affichage du temps de lecture
- Mode plein écran
- Compatible avec tous les navigateurs modernes
- Léger et facile à intégrer

## 🚀 Installation

### Via CDN (recommandé)

Ajoutez simplement cette balise script dans le `<head>` de votre page HTML :

```html
<!-- Dernière version -->
<script src="https://cdn.jsdelivr.net/gh/justlaccom/lectorjs/dist/lector.min.js"></script>

<!-- Version spécifique (recommandé pour la production) -->
<!-- <script src="https://cdn.jsdelivr.net/gh/justlaccom/lectorjs@v1.0.0/dist/lector.min.js"></script> -->
```

### Installation via npm

```bash
npm install @justlaccom/lectorjs
```

Puis importez-le dans votre projet :

```javascript
import Lector from '@justlaccom/lectorjs';
```

### Installation via npm

```bash
npm install lectorjs --save
```

Puis importez-le dans votre projet :

```javascript
import Lector from 'lectorjs';
```

## 🎮 Démarrage rapide

### HTML

```html
<!DOCTYPE html>
<html>
<head>
    <title>LectorJS Demo</title>
    <script src="https://cdn.jsdelivr.net/gh/justlaccom/lectorjs/dist/lector.min.js"></script>
    <style>
        body { 
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .video-container {
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <h1>LectorJS Demo</h1>
    <div id="my-video" class="video-container"></div>

    <script>
        // Initialisation du lecteur
        const player = new Lector('#my-video', {
            width: '100%',
            height: '450px',
            colors: {
                primary: '#2196F3',
                secondary: '#FF4081',
                text: '#ffffff',
                background: '#1a1a1a'
            }
        });

        // Configuration de la source vidéo
        player.setSource('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
    </script>
</body>
</html>
```

## 📚 Documentation complète

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

## ⚙️ Options de configuration

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

## 🛠 Méthodes disponibles

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

## 🔔 Événements

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

## 🎨 Personnalisation

### Thèmes prédéfinis

```javascript
// Thème bleu (par défaut)
const blueTheme = {
    primary: '#2196F3',
    secondary: '#FF4081',
    text: '#ffffff',
    background: '#1a1a1a'
};

// Thème vert
const greenTheme = {
    primary: '#4CAF50',
    secondary: '#8BC34A',
    text: '#ffffff',
    background: '#1a1a1a'
};

// Utilisation
const player = new Lector('#my-video', {
    colors: greenTheme,
    // autres options...
});
```

### Personnalisation avancée

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

## 🌍 Compatibilité

LectorJS est compatible avec tous les navigateurs modernes :

| Navigateur | Version minimale |
|------------|------------------|
| Chrome     | 60+              |
| Firefox    | 55+              |
| Safari     | 11+              |
| Edge       | 16+              |
| Opera      | 47+              |
| iOS Safari | 11+              |
| Android    | 6.0+             |

## 🤝 Contribuer

Les contributions sont les bienvenues ! Voici comment contribuer :

1. Forkez le projet
2. Créez votre branche de fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Poussez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Distribué sous la licence MIT. Voir `LICENSE` pour plus d'informations.

## 🙏 Remerciements

- Icônes par [Feather Icons](https://feathericons.com/)
- Polices par [Google Fonts](https://fonts.google.com/)
- Vidéos de démonstration par [Sample Videos](https://sample-videos.com/)

---

<div align="center">
  Fait avec ❤️ par <a href="https://github.com/justlaccom">just_laccom</a>
</div>

## Licence

MIT
