# EVIDENCIA 14/09/2026

Durante la clase se manejaron 3 ramas diferentes, la primera para los archivos .css, la segunda para el archivo home.ui.js y una terccera rama para el archivo app.js
sin embargo, solo se construyo codigo de forma manual en las ultimas dos ramas

## feature/home-ui
En esta rama se desarrolló el archivo home.ui.js, encargado de generar dinámicamente elementos de la interfaz principal de la aplicación.

Se crearon dos funciones:

createTrackCard: genera tarjetas para mostrar canciones, incluyendo portada, título, artista, género y botón de reproducción.
createRecentlyPlayedRow: genera filas con las canciones reproducidas recientemente, mostrando su portada, información y duración.

Ambas funciones utilizan los datos de un objeto track para construir elementos HTML reutilizables mediante template literals.

posteriormente se agrego una seccion de codigo preparada con anterioridad, pero no se incluira en el reporte de evidencia 

```js
const createTrackCard = (track) => {
    return `
        <article class="track-card group rounded-2xl border border-white/5 bg-zinc-900/80 p-3 transition duration-300 hover:-translate-y-1 hover:border-violet-500/40">
            <div class="relative overflow-hidden rounded-xl">
                <img
                    src="${track.cover}"
                    alt="Portada de ${track.title}"
                    class="track-card-image aspect-square w-full object-cover"
                    loading="lazy"
                >

                <button
                    class="play-track absolute bottom-3 right-4 grid h-11 w-11 place-items-center rounded-full bg-white text-black opacity-0 shadow-xl transition group-hover:opacity-100 focus:opacity-100"
                    data-track-id="${track.id}"
                    aria-label="Seleccionar ${track.title}"
                >
                    ▶
                </button>

                <div class="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-semibold uppercase">
                    ${track.genre}
                </div>
            </div>

            <div class="mt-3">
                <h3 class="truncate font-semibold">${track.title}</h3>
                <p class="mt-1 truncate text-sm text-zinc-500">${track.artist}</p>
            </div>
        </article>
    `;
};

const createRecentlyPlayedRow = (track) => {
    return `
        <article class="grid grid-cols-[auto_1fr_auto_auto] items-center gap-3 rounded-2xl px-3 py-2 transition hover:bg-zinc-900">
            <img
                src="${track.cover}"
                alt="Portada de ${track.title}"
                class="h-12 w-12 rounded-xl object-cover"
                loading="lazy"
            >

            <div class="min-w-0">
                <p class="truncate text-sm font-semibold">${track.title}</p>
                <p class="mt-1 truncate text-xs text-zinc-500">${track.artist}</p>
            </div>
            <span class="hidden text-xs text-zinc-600 sm:block">
                ${track.duration}
            </span>
            <button
                class="play-track grid w-9 h-9 place-items-center rounded-full bg-zinc-800 text-white"${track.id}"
                data-track-id="${track.id}"
                aria-label="Seleccionar ${track.title}"
            >
                ▶
            </button>
        </article>
    `;
};
```

## feature/implementacion-app
En esta rama se trabajó en el archivo app.js, encargado de controlar la lógica principal de la aplicación.

Se importaron los datos de canciones y la función renderHome. También se obtuvieron referencias a diferentes elementos del DOM, como el reproductor y el buscador.

Se creó el arreglo allTracks para combinar las canciones populares y las reproducidas recientemente.

Finalmente, se definió el objeto state, que almacena la vista actual, la canción seleccionada y el estado de reproducción.

La función initializeApp se encarga de iniciar la aplicación, renderizar la vista y registrar los eventos necesarios.

```js
import { recentlyPlayedTracks, trendingTracks } from "./data/mock.data.js";
import { renderHome } from './ui/home.ui.js'

const app = document.querySelector('#app')
const playerTitle = document.querySelector('#player-title')
const playerArtist = document.querySelector('#player-artist')
const playerCover = document.querySelector('#player-cover')
const playerButton = document.querySelector('#play-button')
const globalSearch = document.querySelector('#global-search')

const allTracks = [
    ...trendingTracks,
    ...recentlyPlayedTracks
]

const state = {
    currentView: 'home',
    currentTrack: trendingTracks[0],
    isPlaying: false
}

const initializeApp = () => {
    renderCurrentView()
    registerNavigationEvents()
    registerGlobalEvents()
    updatePlayer()
    updateNavegationStyles()
}
```