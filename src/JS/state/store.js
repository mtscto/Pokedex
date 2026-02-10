// store.js

export const store = {
    //pagination
    offset: 0,
    filterPage: 0,
    isLoading: false,

    //data
    allPokemons: [],
    filteredPokemons: [],
    visiblePokemons: [],

    // modal
    currentList: [],
    currentIndex: -1,

    // search
    isSearching: false,

    // view
    currentViewMode: "dream"
};