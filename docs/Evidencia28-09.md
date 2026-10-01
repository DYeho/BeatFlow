# Evidencia del 28/09/26
Para completar el sitio web BeatFlow se integró la reproducción real de música mediante la API de Audius, que sustituye los datos de prueba por canciones en tendencia y resultados de búsqueda reales. Se incorporaron tres servicios: uno para consumir la API, uno para controlar el elemento de audio y otro para administrar la cola de reproducción. También se añadieron los controles del reproductor: reproducir y pausar, canción anterior y siguiente, barra de progreso y control de volumen. Además, se agregaron vistas de carga, error y sin resultados para mejorar la experiencia del usuario. Con ello, el sitio pasó de ser una maqueta visual a una aplicación funcional.

## app.js
En app.js se agregó la lógica que conecta la interfaz con los servicios de audio, cola y API. Se importaron las funciones de Audius y de los servicios, y se declararon las referencias a los controles del reproductor, como los botones de anterior y siguiente, la barra de progreso y el volumen. Se implementó la función playTrack, que obtiene la canción seleccionada, define la cola y reproduce el audio, junto con playNextTrack y playPreviousTrack para navegar entre pistas. También se registraron los eventos del reproductor para actualizar el estado, el progreso y el contador de tiempo. Finalmente, se programaron los eventos de la barra de progreso y del volumen para controlar el audio en tiempo real.
```js
// constantes de sesion 03
const previousButton = document.querySelector('#previous-button')
const nextButton = document.querySelector('#next-button')
const progressRange = document.querySelector('#progress-range')
const volumeRange = document.querySelector('#volume-range')

const playerUI = createPlayerUI()

const currentTimeLabel = document.querySelector('#current-time')
const durationTimeLabel = document.querySelector('#duration-time')

 // funcion register player events
function registerPlayerEvents() {
  onPlayerEvent('play', () => {
    state.isPlaying = true
    updatePlayer()
  })

  onPlayerEvent('pause', () => {
    state.isPlaying = false
    updatePlayer()
  })

  onPlayerEvent('ended', async () => {
    const nextTrack = getNextTrack()

    if (!nextTrack) {
      state.isPlaying = false
      updatePlayer()
      return
    }

    await loadAndPlayTrack(nextTrack)
  })

  onPlayerEvent('timeupdate', ({ currentTime, duration }) => {
    currentTimeLabel.textContent = formatTime(currentTime)
    durationTimeLabel.textContent = formatTime(duration)

    const progress = duration ? (currentTime / duration) * 100 : 0
    progressRange.value = String(Math.min(100, Math.max(0, progress)))
  })

  onPlayerEvent('metadata', ({ duration }) => {
    currentTimeLabel.textContent = '0:00'
    durationTimeLabel.textContent = formatTime(duration)
    progressRange.value = '0'
  })

  onPlayerEvent('error', (error) => {
    console.error(
      'Error del reproductor:',
      error,
    )

    state.isPlaying = false
    updatePlayer()
  })
}

// funcion sesion 3
function getActiveCollection() {
  if(state.currentView === 'search' && state.searchResults.length > 0) {
    return state.searchResults
  }
  return state.trendingTracks
}

async function playTrack(trackId) {
  const tracks = getActiveCollection()
  const track = tracks.find((item) => item.id === trackId)
  if(!track){
    return
  } 
  if (track.isStreamable === false) {
    alert('La cancion no esta disponible')
    return
  } 
  setQueue(tracks, track.id)
  await loadAndPlayTrack(track)
}

async function loadAndPlayTrack(track) {
  try {
    state.currentTrack = track
    playerUI.renderTrack(track)
    const streamUrl = getTrackStreamUrl(track.id)
    loadAudio(streamUrl)
    await playAudio()
  } catch (error) {
    alert(`No es posible reproducir la cancion ${error}`)
  }
}

async function playNextTrack() {
  const track = getNextTrack()
  if(!track){
    return
  }
  await loadAndPlayTrack(track)
}

async function playPreviousTrack() {
  const snapshot = getPlayerSnapshot()
  if (snapshot.currentTime > 3) {
    seekAudio(0)
    return
  }
  const track = getPreviusTrack()
  if (!track) {
    return
  }
  await loadAndPlayTrack(track)
}

function registerPlayerTrack(track){
  onPlayerEvent('play', () => {
    state.isPlaying = true
    playerUI.renderPlaying(true)
  })
  onPlayerEvent('pause', () => {
    state.isPlaying = false
    playerUI.renderPlaying(false)
  })

  onPlayerEvent('timeupdate', (payload) => {
    playerUI.renderProgress(payload)
  })
  onPlayerEvent('metadata', ({ duration }) => {
    playerUI.renderProgress({
      currentTime: 0,
      duration
    })
  })

  onPlayerEvent('volumechage', ({volume}) => {
    playerUI.renderVolume(volume)
  })

  onPlayerEvent('end', playNextTrack)
  onPlayerEvent('error', (error) => {
    console.error('Audio error:', error)
  })
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const minutes = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${minutes}:${String(secs).padStart(2, '0')}`
}

```

# index.html
En index.html se modifico la estructura del reproductor ubicado en la parte inferior de la página. Esta incluye la portada, el título y el artista de la canción actual, así como los botones de canción anterior, reproducir o pausar y canción siguiente. También se añadieron la barra de progreso con las etiquetas de tiempo transcurrido y duración total, y el control deslizante de volumen. Cada elemento cuenta con un identificador y una etiqueta de accesibilidad, lo que permite que app.js los controle y que el reproductor sea más fácil de usar. Además, se cargó el SDK de Audius mediante un script, necesario para consultar las canciones.
```html
 <footer
    class="fixed inset-x-0 bottom-[68px] z-40 border-t
           border-white/10 bg-zinc-950/95 backdrop-blur
           lg:bottom-0 lg:left-[250px]"
  >
    <div
      class="grid min-h-[96px] grid-cols-[1fr_auto]
             items-center gap-4 px-4 py-3
             md:grid-cols-[1fr_1.4fr_1fr] md:px-6"
    >

      <div class="flex min-w-0 items-center gap-3">
        <img
          id="player-cover"
          src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=160&q=80"
          alt="Portada actual"
          class="h-14 w-14 rounded-xl object-cover"
        >

        <div class="min-w-0">
          <p id="player-title" class="truncate text-sm font-semibold">
            Selecciona una cancion
          </p>
          <p id="player-artist" class="truncate text-xs text-zinc-500">
            BeatFlow
          </p>
        </div>
      </div>


      <div class="flex flex-col items-center gap-2">
        <div class="flex items-center gap-4">
          <button 
            type="button" 
            aria-label="Cancion anterior"
            id="previous-button"
            class="text-zinc-400 transition hover:text-white"
          >
            ◀
          </button>

          <button
            id="play-button"
            type="button"
            class="grid h-11 w-11 place-items-center rounded-full
                   bg-white text-black transition hover:scale-105"
            aria-label="Reproducir"
          >
            ▶
          </button>

          <button 
            type="button" 
            aria-label="Cancion siguiente"
            id="next-button"
            class="text-zinc-400 transition hover:text-white"
          >
            ▶
          </button>
        </div>

        <div class="hidden w-full items-center gap-3 md:flex">
          <span id="current-time" class="w-10 text-right text-xs text-zinc-500">
            0:00
          </span>
          <input 
            type="range"
            class="player-range flex-1"
            id="progress-range"
            min="0"
            max="100"
            value="0"
            step="0.1"
            aria-label="Progreso de reproduccion"
          >
          <span id="duration-time" class="w-10 text-right text-xs text-zinc-500">
            0:00
          </span>
        </div>
      </div>

      <div class="hidden items-center justify-end gap-3 md:flex">
        <span aria-hidden="true"></span>
        <input
          type="range"
          class="player-range w-28"
          id="volume-range"
          min="0"
          max="1"
          value="0.7"
          step="0.01"
          aria-label="Volumen"
        >
      </div>
    </div>
  </footer>
```