import { store } from "../state/store.js"
import { animatePokemonCards } from "./animation.js";
import { createCardSkeleton } from "../list/cardSkeleton.js";

const pokemonList = document.getElementById("pokemonList");

/* RENDER */

function appendPokemons(pokemons, { reset = false, animate = true } = {}) {

  if (reset) {
    pokemonList.innerHTML = "";
    store.visiblePokemons = [];
  }

  const fragment = document.createDocumentFragment();

  pokemons.forEach(pokemon => {
    const li = document.createElement("li");
    li.className = `pokemon ${pokemon.type}`;
    li.dataset.pokemon = JSON.stringify(pokemon);

    if (!animate) {
      li.classList.add("show");
    }

    const sprite =
      pokemon.sprites[store.currentViewMode] ||
      pokemon.sprites.dream;

    li.innerHTML = `
      <div class="pokemon-card">
        <div class="pokemon-info">
          <h3 class="pokemon-name">${pokemon.name}</h3>
          <div class="pokemon-types">
            ${pokemon.types.map(type =>
      `<span class="type ${type}">${type}</span>`
    ).join("")}
          </div>
        </div>

        <span class="pokeball-bg"></span>

        <div class="pokemon-visual">
          <img src="${sprite}" alt="${pokemon.name}" class="pokemon-image ${store.currentViewMode}">
        </div>
      </div>
    `;

    fragment.appendChild(li);
  });

  pokemonList.appendChild(fragment);

  if (animate) animatePokemonCards();
}


function showSkeletons() {
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < store.pageSize; i++) {
    fragment.appendChild(createCardSkeleton());
  }
  pokemonList.appendChild(fragment);
}

export {
  appendPokemons,
  showSkeletons
};
