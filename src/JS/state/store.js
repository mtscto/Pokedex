import { LIMIT } from "../config/app-config.js"

// store.js
export const store = {
    // data base
    allPokemons: [],
    visiblePokemons: [],

    //query state
    searchQuery: "",
    activeFilters: new Set(["all"]),
    currentPage: 1,
    pageSize: LIMIT,

    // modal
    currentIndex: -1,
    currentList: [],

    // view
    currentViewMode: "dream",
};