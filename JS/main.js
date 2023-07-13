const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 300
const limit = 20;
let offset = 0;




function loadPokemonsItems(limit, offset) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map((pokemon) => `
                <li class="pokemon ${pokemon.type}">
                    <span class="number">#${pokemon.number}</span>
                    <span class="name">${pokemon.name}</span>
        
                    <div class="detail">
                        <ol class="types">
                            ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                        </ol>
        
                        <img src="${pokemon.photo}"
                             alt="${pokemon.name}">
                    </div>
                    <!--
                    <div class="poke-btn" id="btn-pokeD">More Details<br></div>
                    -->
                    <!-- Page More Pokemons -->
                    <!--
                        <div class="more-container" id="mp">
                            <div class="more-page">
                                <span class="number-mp">#${pokemon.number}</span>
                                <span class="name-mp">${pokemon.name}</span>

                                <div class="detail-mp">
                                    <ol class="types-mp">
                                        ${pokemon.types.map((type) => `<li class="type-mp ${type}">${type}</li>`).join('')}
                                    </ol>  
                                </div>
                                <div class="poke-img">
                                    <img src="${pokemon.photo}" alt="${pokemon.name}">
                                </div>
                            </div>        
                        </div>
                    -->
                </li>
            `).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonsItems(limit, offset)

loadMoreButton.addEventListener('click', () => {
    offset += limit

    const qtRecordNextPage = offset + limit

    if (qtRecordNextPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonsItems(newLimit, offset)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonsItems(limit, offset)
    }
})


let playButton = document.querySelector('.pokemon');





