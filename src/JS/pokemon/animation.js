/* ANIMATION */

export function animatePokemonCards() {
    const cards = pokemonList.querySelectorAll(".pokemon:not(.show)");

    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add("show");
        }, index * 50);
    });

}