import { store } from "./state/store.js";
import { pokeApi } from "./api/poke-api.js";
import { initSearch } from "./ui/search.js";
import { MAX_RECORDS } from "./config/app-config.js";
import { updateList, handleLoadMore } from "./list/list.js";
import { initLoadMore, ensureLoadMoreButton } from "./ui/loadMore.js";
import { initFilters } from "./ui/filters.js";
import { initViewToggle } from "./ui/viewToggle.js";
import { openModal, closeModal } from "./modal/modal.js";
import { goPrev, goNext, initModalNavigation } from "./modal/modalNavigation.js";
import { initNavbar } from "./ui/navbar.js";
import { showSkeletons } from "./pokemon/render.js";


/* ============================
   STATE & ELEMENTS
============================ */

const config = document.getElementById("config-id");

/* ============================
   INIT STATES
============================ */

initSearch({
  onSearchStateChange: () => {
    store.currentPage = 1;
    updateList();
  }
});

initLoadMore({
  onLoadMore: handleLoadMore
});

initFilters({
  onFilterChange: () => {
    store.currentPage = 1;
    updateList();
  }
})

initViewToggle({
  onViewChange: () => {
    updateList(() => ensureLoadMoreButton(pokemonList));
  }
});
initModalNavigation({ config });
initNavbar();

/* ============================
   INITIAL LOAD
============================ */

showSkeletons();

pokeApi.getPokemons(0, MAX_RECORDS).then(pokemons => {
  store.allPokemons = pokemons;
  store.currentPage = 1;
  updateList(() => ensureLoadMoreButton(pokemonList));
});

/* ============================
   GLOBAL EVENTS
============================ */

document.addEventListener("click", e => {
  const card = e.target.closest(".pokemon:not(.skeleton)");
  if (card) openModal(JSON.parse(card.dataset.pokemon));

  if (e.target.closest('[data-action="close"]') || e.target === config) {
    closeModal();
  }

  const prevBtn = e.target.closest(".modal-prev");
  const nextBtn = e.target.closest(".modal-next");

  if (prevBtn && !prevBtn.classList.contains("disabled")) {
    goPrev();
  }

  if (nextBtn && !nextBtn.classList.contains("disabled")) {
    goNext();
  }
});
