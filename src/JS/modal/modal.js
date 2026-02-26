import { store } from "../state/store.js";
import { updateModalNavigation } from "./modalNavigation.js";

const modalContainer = document.getElementById("config-id");

const MODAL_ANIMATION_DURATION = 250;

export function openModal(pokemon, fromNavigation = false) {
  if (!modalContainer) return;

  if (!fromNavigation) {
    store.currentList = store.visiblePokemons;
    store.currentIndex = store.currentList.findIndex(
      p => p.number === pokemon.number
    );
  }

  modalContainer.innerHTML = buildModalTemplate(pokemon);
  modalContainer.style.display = "flex";

  document.body.style.overflow = "hidden";

  updateModalNavigation(modalContainer);
}

export function closeModal() {
  if (!modalContainer) return;

  modalContainer.classList.add("closing");

  setTimeout(() => {
    modalContainer.classList.remove("closing");
    modalContainer.style.display = "none";
    modalContainer.innerHTML = "";

    // Restore scroll
    document.body.style.overflow = "";
  }, MODAL_ANIMATION_DURATION);
}

function buildModalTemplate(pokemon) {
  return `
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
            ${pokemon.types
      .map(type => `<span class="type">${type}</span>`)
      .join("")}
          </div>
          <span class="number">#${pokemon.number}</span>
        </div>

        <div class="cloud-bg"></div>
        <div class="pokeball-bg"></div>

        <div class="pokemon-wrapper">
          <img 
            src="${pokemon.sprites?.[store.currentViewMode] || pokemon.photo}" 
            alt="${pokemon.name}" 
            class="modal-sprites ${store.currentViewMode}"
          >
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
