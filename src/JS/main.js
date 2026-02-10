import { store } from "./state/store.js";
import { pokeApi } from "./api/poke-api.js";

/*   STATE & ELEMENTS */

const pokemonList = document.getElementById("pokemonList");
const config = document.getElementById("config-id");
const btnUp = document.querySelector(".btn-up");

const maxRecords = 649;
const limit = 12;



/* SEARCH */

const navbar = document.querySelector(".navbar");
const searchBtn = document.getElementById("toggleSearch");
const searchInput = document.getElementById("searchInput");
const searchIcon = document.getElementById("searchIcon");
const closeIcon = document.getElementById("closeIcon");

let searchTimeout = null;

/* Search */

if (!searchBtn || !searchInput) {
  console.warn("Search elements not found")
}

searchBtn.addEventListener("click", () => {
  const active = navbar.classList.toggle("search-active");

  if (searchIcon) searchIcon.hidden = active;
  if (closeIcon) closeIcon.hidden = !active;

  if (active) {
    searchInput.focus();
    store.isSearching = true;
  } else {
    clearSearch();
  }
});

searchInput.addEventListener("input", () => {
  clearTimeout(searchTimeout);

  searchTimeout = setTimeout(() => {
    ensureAllPokemonLoaded().then(() => {
      handleSearch(searchInput.value.trim().toLowerCase());
    })
  }, 300);
});

const viewButtons = document.querySelectorAll(".view-btn");

viewButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    viewButtons.forEach(b => b.classList.remove("is-active"));
    btn.classList.add("is-active");

    currentViewMode = btn.dataset.view;
  });
});


/* LOAD MORE BUTTON */

function createLoadMoreButton() {
  const btn = document.createElement("button");
  btn.id = "loadMoreButton";
  btn.classList.add("btn", "btn-load");
  btn.textContent = "Load more";
  btn.addEventListener("click", loadMorePokemons);
  return btn;
}

function ensureLoadMoreButton() {
  if (!document.getElementById("loadMoreButton")) {
    pokemonList.after(createLoadMoreButton());
  }
}

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

function resetListState() {
  removeEndMessage();
  ensureLoadMoreButton();
  store.isLoading = false;
}

/* API LOAD (ALL) */

function loadPokemonItems(start, amount) {
  store.isLoading = true;

  return pokeApi.getPokemons(start, amount).then(pokemons => {
    store.isLoading = false;
    return pokemons.filter(p => p.number <= maxRecords);
  });
}

/* LOAD MORE (ROUTER) */

function loadMorePokemons() {
  if (store.isSearching) return;
  if (store.isLoading) return;

  const btn = document.getElementById("loadMoreButton");
  btn.disabled = true;
  btn.textContent = "Loading...";

  // FILTRO ATIVO
  if (isFilterActive()) {
    loadMoreWithFilter();
    return;
  }

  // ALL
  loadPokemonItems(store.offset, limit).then(pokemons => {
    store.offset += pokemons.length;
    appendPokemons(pokemons, true, true);

    // FIM DA DEX
    if (store.offset >= maxRecords || pokemons.length === 0) {
      showEndMessage(); // remove botão + mostra texto
      return;
    }

    // CONTINUA
    btn.disabled = false;
    btn.textContent = "Load more";
  });
}

/* LOAD MORE WITH FILTER */

function loadMoreWithFilter() {
  const start = store.filterPage * limit;
  const end = start + limit;
  const slice = store.filteredPokemons.slice(start, end);

  // 👉 acabou a lista
  if (slice.length === 0) {
    showEndMessage();
    return;
  }

  appendPokemons(slice, true, store.filterPage === 0);
  store.filterPage++;

  const nextStart = store.filterPage * limit;

  // garante botão ativo
  if (nextStart < store.filteredPokemons.length) {
    ensureLoadMoreButton();

    const btn = document.getElementById("loadMoreButton");
    if (btn) {
      btn.disabled = false;
      btn.textContent = "Load more";
    }
  } else {
    // acaba exatamente após essa renderização
    showEndMessage();
  }
}

/* Search Functions */

function ensureAllPokemonLoaded() {
  if (store.allPokemons.length > 0) return Promise.resolve();

  return pokeApi.getPokemons(0, maxRecords).then(pokemons => {
    store.allPokemons = pokemons;
  });
}

function handleSearch(query) {
  pokemonList.innerHTML = "";
  removeEndMessage();
  const loadMoreBtn = document.getElementById('loadMoreButton');
  if (loadMoreBtn) loadMoreBtn.remove();

  if (!query) {
    restoreDefaultState();
    return;
  }

  const source = store.allPokemons.length
    ? store.allPokemons
    : store.filteredPokemons.length
      ? store.filteredPokemons
      : [];

  const results = source.filter(pokemon =>
    pokemon.name.includes(query) ||
    pokemon.number.toString() === query
  );

  appendPokemons(results, false, true);
}

function clearSearch() {
  searchInput.value = "";
  navbar.classList.remove("search-active");

  searchIcon.hidden = false;
  closeIcon.hidden = true;

  store.isSearching = false;
  restoreDefaultState();
}

function restoreDefaultState() {
  pokemonList.innerHTML = "";

  if (isFilterActive()) {
    store.filterPage = 0;
    loadMoreWithFilter();
  } else {
    store.offset = 0;
    loadPokemonItems(store.offset, limit).then(pokemons => {
      store.offset += pokemons.length;
      appendPokemons(pokemons, true, true);
      ensureLoadMoreButton();
    });
  }
}



/* APPLY FILTER */

function applyFilter() {
  resetListState();
  const types = [...activeFilters];

  store.filteredPokemons = store.allPokemons.filter(pokemon =>
    pokemon.types.some(type => types.includes(type))
  );

  store.filterPage = 0;
  loadMoreWithFilter();
}

/* INITIAL LOAD (ALL) */

loadPokemonItems(store.offset, limit).then(pokemons => {
  store.offset += limit;
  appendPokemons(pokemons, true, true);
  ensureLoadMoreButton();
});

/* ANIMATION */

function animatePokemonCards() {
  const cards = document.querySelectorAll(".will-animate");

  cards.forEach((card, index) => {
    setTimeout(() => {
      card.classList.add("show");
      card.classList.remove("will-animate");
    }, index * 80);
  });
}

/* RENDER */

function appendPokemons(pokemons, animate = false, reset = false) {
  if (reset) {
    store.visiblePokemons = [];
    pokemonList.innerHTML = "";
  }

  store.visiblePokemons = [...store.visiblePokemons, ...pokemons];

  const fragment = document.createDocumentFragment();

  pokemons.forEach(pokemon => {
    const li = document.createElement("li");
    li.className = `pokemon ${pokemon.type}`;
    li.dataset.pokemon = JSON.stringify(pokemon);

    li.classList.add(animate ? "will-animate" : "show");

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

        <div class="pokemon-visual">
          <span class="pokeball-bg"></span>
          <img src="${pokemon.photo}" alt="${pokemon.name}" class="pokemon-image">
        </div>
      </div>
    `;

    fragment.appendChild(li);
  });

  pokemonList.appendChild(fragment);
  if (animate) animatePokemonCards();
}


/* FILTERS */

const filterButtons = document.querySelectorAll(".filter-btn");
const allButton = document.querySelector('.filter-btn[data-type="all"]');
let activeFilters = new Set(["all"]);

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    const type = button.dataset.type;

    // ===== ALL (exclusivo) =====
    if (type === "all") {
      activeFilters.clear();
      activeFilters.add("all");

      filterButtons.forEach(btn =>
        btn.classList.toggle("is-active", btn === allButton)
      );

      pokemonList.innerHTML = "";
      store.offset = 0;

      ensureLoadMoreButton();

      loadPokemonItems(offset, limit).then(pokemons => {
        store.offset += pokemons.length;
        appendPokemons(pokemons, true);
      });

      return;
    }

    // ===== MULTI FILTER =====
    activeFilters.delete("all");
    allButton.classList.remove("is-active");

    if (activeFilters.has(type)) {
      activeFilters.delete(type);
      button.classList.remove("is-active");
    } else {
      activeFilters.add(type);
      button.classList.add("is-active");
    }

    // Se removeu todos → volta para ALL
    if (activeFilters.size === 0) {
      activeFilters.add("all");
      allButton.classList.add("is-active");

      pokemonList.innerHTML = "";
      store.offset = 0;

      ensureLoadMoreButton();

      loadPokemonItems(store.offset, limit).then(pokemons => {
        store.offset += pokemons.length;
        appendPokemons(pokemons, true);
      });

      return;
    }

    // ===== APLICA FILTRO =====
    pokemonList.innerHTML = "";
    store.filterPage = 0;

    ensureLoadMoreButton();

    if (store.allPokemons.length === 0) {
      pokeApi.getPokemons(0, maxRecords).then(pokemons => {
        store.allPokemons = pokemons;
        applyFilter();
      });
    } else {
      applyFilter();
    }
  });
});


function isFilterActive() {
  return !activeFilters.has("all");
}

/* MODAL */

function openModal(pokemon) {
  // Define a lista ativa correta
  store.currentList = store.visiblePokemons;

  // Define o índice atual
  store.currentIndex = store.currentList.findIndex(p => p.number === pokemon.number);

  config.innerHTML = `

    <div class="modal-nav">
  <button class="modal-prev" aria-label="Anterior">
    <svg viewBox="0 0 24 24">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  </button>

  <button class="modal-next" aria-label="Próximo">
    <svg viewBox="0 0 24 24">
      <path d="M9 6l6 6-6 6" />
    </svg>
  </button>
</div>

    <div class="config-card ${pokemon.type}">

      <div class="config-header">
        <div class="header-top">
          <h2>${pokemon.name}</h2>
          <button class="close-btn" data-action="close" aria-label="Voltar">
            <svg width="20" height="20" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        </div>

        <div class="header-meta">
          <div class="types">
            ${pokemon.types.map(type => `<span class="type">${type}</span>`).join("")}
          </div>
          <span class="number">#${pokemon.number}</span>
        </div>

        <div class="cloud-bg"></div>
        <div class="pokeball-bg"></div>

        <div class="pokemon-wrapper">
          <img src="${pokemon.photo}" alt="${pokemon.name}">
        </div>
      </div>

      <div class="config-body">
        <ul class="stats">
          ${createStat("HP", pokemon.hp, "hp")}
          ${createStat("ATK", pokemon.atk, "atk")}
          ${createStat("DEF", pokemon.def, "def")}
          ${createStat("SATK", pokemon.spcatk, "satk")}
          ${createStat("SDEF", pokemon.spcdef, "sdef")}
          ${createStat("SPD", pokemon.speed, "spd")}
        </ul>
      </div>
    </div>
  `;

  config.style.display = "flex";
  updateModalNavButtons();
}

function updateModalNavButtons() {
  const prevBtn = document.querySelector(".modal-prev");
  const nextBtn = document.querySelector(".modal-next");

  if (!prevBtn || !nextBtn) return;

  prevBtn.classList.toggle("disabled", store.currentIndex <= 0);
  nextBtn.classList.toggle("disabled", store.currentIndex >= store.currentList.length - 1);
}


function goPrevPokemon() {
  if (store.currentIndex <= 0) return;
  store.currentIndex--;
  openModal(store.currentList[store.currentIndex]);
}

function goNextPokemon() {
  if (store.currentIndex >= store.currentList.length - 1) return;
  store.currentIndex++;
  openModal(store.currentList[store.currentIndex]);
}



function closeModal() {
  config.classList.add("closing");
  setTimeout(() => {
    config.classList.remove("closing");
    config.style.display = "none";
    config.innerHTML = "";
  }, 250);
}

function createStat(label, value, type) {
  return `
    <li class="stat">
      <span>${label}</span>
      <div class="poke-bar">
        <div class="bar bar-${type}" style="width:${value}%"></div>
      </div>
    </li>
  `;
}

/* GLOBAL EVENTS */

document.addEventListener("click", e => {
  const card = e.target.closest(".pokemon");
  if (card) openModal(JSON.parse(card.dataset.pokemon));

  if (e.target.closest('[data-action="close"]') || e.target === config) {
    closeModal();
  }

  const prevBtn = e.target.closest(".modal-prev");
  const nextBtn = e.target.closest(".modal-next");

  if (prevBtn && !prevBtn.classList.contains("disabled")) {
    goPrevPokemon();
  }

  if (nextBtn && !nextBtn.classList.contains("disabled")) {
    goNextPokemon();
  }

});

/* KEYBOARD NAVIGATION */

document.addEventListener("keydown", e => {
  if (config.style.display !== "flex") return;

  if (e.key === "ArrowLeft") goPrevPokemon();
  if (e.key === "ArrowRight") goNextPokemon();
});


/* BUTTON UP */

window.addEventListener("scroll", () => {
  btnUp.classList.toggle("show", window.scrollY > 50);
});

btnUp.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* FILTERS DRAWER */

const openFiltersBtn = document.getElementById("openFilters");
const filtersDrawer = document.getElementById("filters");
const closeFiltersBtn = document.querySelector(".filters-close");

openFiltersBtn.addEventListener("click", () => {
  filtersDrawer.classList.add("is-open");
});

closeFiltersBtn.addEventListener("click", () => {
  filtersDrawer.classList.remove("is-open");
});

document.addEventListener("click", e => {
  if (
    filtersDrawer.classList.contains("is-open") &&
    !filtersDrawer.contains(e.target) &&
    !openFiltersBtn.contains(e.target)
  ) {
    filtersDrawer.classList.remove("is-open");
  }
});


/* SWIPE NAVIGATION (MOBILE) */

let touchStartX = 0;
let touchEndX = 0;

config.addEventListener("touchstart", e => {
  touchStartX = e.changedTouches[0].screenX;
});

config.addEventListener("touchend", e => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
});

function handleSwipe() {
  const delta = touchEndX - touchStartX;

  if (Math.abs(delta) < 50) return;

  if (delta > 0) goPrevPokemon();
  else goNextPokemon();
}

