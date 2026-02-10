import { Pokemon } from "../pokemon/pokemon-model.js"


function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type
    pokemon.sprites = {
        dream: pokeDetail.sprites.other.dream_world.front_default,
        official: pokeDetail.sprites.other["official-artwork"].front_default,
        pixel: pokeDetail.sprites.other.front_default
    }
    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default
    pokemon.hp = pokeDetail.stats[0].base_stat
    pokemon.atk = pokeDetail.stats[1].base_stat
    pokemon.def = pokeDetail.stats[2].base_stat
    pokemon.spcatk = pokeDetail.stats[3].base_stat
    pokemon.spcdef = pokeDetail.stats[4].base_stat
    pokemon.speed = pokeDetail.stats[5].base_stat

    return pokemon
}

function getPokemonDetail(pokemon) {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon)
}

function getPokemons(offset = 0, limit = 12) {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

    return fetch(url)
        .then(response => response.json())
        .then(jsonBody => jsonBody.results)
        .then(pokemons => {
            // resolve detalhes UM POR UM, tolerando falhas
            const detailPromises = pokemons.map(pokemon =>
                pokeApi.getPokemonDetail(pokemon)
                    .catch(err => {
                        console.warn("Falha ao carregar:", pokemon.name);
                        return null; // não quebra o fluxo
                    })
            );

            return Promise.all(detailPromises);
        })
        .then(pokemonDetails =>
            // remove os que falharam
            pokemonDetails.filter(p => p !== null)
        );
};

export const pokeApi = {
    convertPokeApiDetailToPokemon,
    getPokemons,
    getPokemonDetail
};

