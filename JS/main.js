const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 649
let limit =649;
let offset = 0;

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>
                    <div class="poke-img"><img src="${pokemon.photo}"
                        alt="${pokemon.name}">
                    </div>       
            </div>


            <ul class="poke-stats">
                <li class="stats-li">HP</li> <li>${pokemon.hp}</li> <li class="poke-bar"><div class="bar-hp bar" style="width: ${pokemon.hp}%">&nbsp;</div></li>
                <li class="stats-li">ATK</li> <li>${pokemon.atk}</li> <li class="poke-bar"><div class="bar-atk bar" style="width: ${pokemon.atk}%">&nbsp;</div></li>
                <li class="stats-li">DEF</li> <li>${pokemon.def}</li> <li class="poke-bar"><div class="bar-def bar" style="width: ${pokemon.def}%">&nbsp;</div></li>
                <li class="stats-li">SATK</li> <li>${pokemon.spcatk}</li> <li class="poke-bar"><div class="bar-satk bar" style="width: ${pokemon.spcatk}%">&nbsp;</div></li>
                <li class="stats-li">SDEF</li> <li>${pokemon.spcdef}</li> <li class="poke-bar"><div class="bar-sdef bar" style="width: ${pokemon.spcdef}%">&nbsp;</div></li>
                <li class="stats-li">SPD</li> <li>${pokemon.speed}</li> <li class="poke-bar" ><div class="bar-spd bar" style="width: ${pokemon.speed}%">&nbsp;</div></li>
            </ul>

            <button class="pokemon-btn" id="btn-pokedetails">More details</button>
            <button type="button" class="close-btn" id="closeBtn">X</button>  
        </li>
    `
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit

    const qtRecordNextPage = offset + limit

    if (qtRecordNextPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(newLimit, offset)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(limit, offset)
    }
})

let config = document.querySelector('#config-id')
let closeconfigBtn = document.querySelector('#closeBtn')

document.addEventListener('click', function(e){
    if(e.target.innerText == "More details"){
        config.style.display = "flex"
        let pokeActual = e.target.parentElement
        var pokeLi = document.querySelector('#configpoke')
        pokeLi.innerHTML = pokeActual.innerHTML
        let pokeClass = pokeActual.classList[1]
        pokeLi.classList = pokeClass
        pokeLi.classList.add("mostrar")
 
    }
    if(e.target.id == "closeBtn"){
        config.style.display = "none"
    }
})


