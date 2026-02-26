import { store } from "../state/store.js"
import { MAX_RECORDS } from "../config/app-config.js";
import { pokeApi } from "../api/poke-api.js"

/* SEARCH */

const navbar = document.querySelector(".navbar");
const searchBtn = document.getElementById("toggleSearch");
const searchInput = document.getElementById("searchInput");
const searchIcon = document.getElementById("searchIcon");
const closeIcon = document.getElementById("closeIcon");

let searchTimeout = null;
let onResetCallback = null;
let onSearchStateChangeCallback = null;

// INIT

export function initSearch({ onReset, onSearchStateChange }) {
    onResetCallback = onReset;
    onSearchStateChangeCallback = onSearchStateChange;

    searchBtn.addEventListener('click', toggleSearch);
    searchInput.addEventListener('input', onSearchInput);
}

// TOGGLE

function toggleSearch() {
    const active = navbar.classList.toggle("search-active");

    searchIcon.hidden = active;
    closeIcon.hidden = !active;

    if (active) {
        searchInput.focus();
        store.isSearching = true;

        if (onSearchStateChangeCallback) {
            onSearchStateChangeCallback(true);
        }
    } else {
        clearSearch();
    }
}

// INPUT

function onSearchInput() {
    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(async () => {
        const query = searchInput.value.trim().toLowerCase();

        await ensureAllPokemonLoaded();
        handleSearch(query);
    }, 300);
}

// LOAD ALL IF NEEDED

async function ensureAllPokemonLoaded() {
    if (store.allPokemons.length > 0) return;

    const pokemons = await pokeApi.getPokemons(0, MAX_RECORDS);
    store.allPokemons = pokemons;
}

// FILTER LOGIC

function handleSearch(query) {
    store.searchQuery = query;
    store.isSearching = !!query;

    if (onSearchStateChangeCallback) {
        onSearchStateChangeCallback();
    }
}

// CLEAR SEARCH

function clearSearch() {
    searchInput.value = "";
    navbar.classList.remove("search-active");

    searchIcon.hidden = false;
    closeIcon.hidden = true;

    store.searchQuery = "";
    store.isSearching = false;

    if (onSearchStateChangeCallback) {
        onSearchStateChangeCallback(false);
    }
}
