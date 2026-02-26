import { store } from "../state/store.js";
import { appendPokemons } from "../pokemon/render.js";
import { ensureLoadMoreButton } from "../ui/loadMore.js";

const pokemonList = document.getElementById("pokemonList");

/* ============================
   HELPERS
============================ */

function getFilteredResult() {
    let result = [...store.allPokemons];

    // APPLY FILTERS
    if (!store.activeFilters.has("all")) {
        result = result.filter(pokemon =>
            pokemon.types.some(type =>
                store.activeFilters.has(type)
            )
        );
    }

    // APPLY SEARCH
    if (store.searchQuery) {
        result = result.filter(pokemon =>
            pokemon.name.includes(store.searchQuery) ||
            pokemon.number.toString() === store.searchQuery
        );
    }

    return result;
}

/* ============================
   END STATE
============================ */

function showEndMessage() {
    if (document.querySelector(".pokedex-end")) return;

    const btn = document.getElementById("loadMoreButton");
    if (btn) btn.remove();

    const endMessage = document.createElement("div");
    endMessage.className = "pokedex-end";
    endMessage.textContent = "You've reached the end of the Pokédex";

    pokemonList.after(endMessage);
}

function removeEndMessage() {
    const end = document.querySelector(".pokedex-end");
    if (end) end.remove();
}

/* ============================
   EMPTY STATE
============================ */

function showEmptyMessage() {
    if (document.querySelector(".pokedex-empty")) return;

    const emptyMessage = document.createElement("div");
    emptyMessage.className = "pokedex-empty";
    emptyMessage.innerHTML = `
        <h3>No Pokémon found</h3>
        <p>Try another name or filter.</p>
    `;

    pokemonList.after(emptyMessage);
}

function removeEmptyMessage() {
    const empty = document.querySelector(".pokedex-empty");
    if (empty) empty.remove();
}

/* ============================
   MAIN RENDER (RESET + PAGE 1)
============================ */

function updateList() {
    removeEndMessage();
    removeEmptyMessage();

    const result = getFilteredResult();

    const end = store.currentPage * store.pageSize;
    const paginated = result.slice(0, end);

    store.visiblePokemons = paginated;

    pokemonList.innerHTML = "";

    if (paginated.length === 0) {
        showEmptyMessage();
        return;
    }

    appendPokemons(paginated);

    if (paginated.length >= result.length) {
        showEndMessage();
    } else {
        ensureLoadMoreButton(pokemonList);
    }
}

/* ============================
   LOAD MORE (APPEND ONLY)
============================ */

function handleLoadMore() {
    const result = getFilteredResult();

    const previousEnd = (store.currentPage - 1) * store.pageSize;
    const newEnd = store.currentPage * store.pageSize;

    const newPokemons = result.slice(previousEnd, newEnd);

    store.visiblePokemons = result.slice(0, newEnd)

    appendPokemons(newPokemons);

    if (newEnd >= result.length) {
        const btn = document.getElementById("loadMoreButton");
        if (btn) btn.remove();
        showEndMessage();
    }
}

export {
    updateList,
    handleLoadMore
};
