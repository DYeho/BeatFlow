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