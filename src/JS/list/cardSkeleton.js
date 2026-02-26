export function createCardSkeleton() {
    const li = document.createElement("li");
    li.classList.add("pokemon", "skeleton")

    li.innerHTML = `
    <div class="pokemon-card">
        <div class="pokemon-info">
            <div class="pokemon-name skeleton-box"></div>
            <div class="pokemon-types">
                <span class="type skeleton-pill"></span>
                <span class="type skeleton-pill"></span>
            </div>
        </div>

        <span class="pokeball-bg skeleton-bg"></span>

        <div class="pokemon-visual">
            <div class="pokemon-image skeleton-image"></div>
        </div>
    </div>
    `;

    return li;
}