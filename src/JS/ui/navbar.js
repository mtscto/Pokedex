export function initNavbar() {
    const btnUp = document.querySelector(".btn-up");
    const openFiltersBtn = document.getElementById("openFilters");
    const filtersDrawer = document.getElementById("filters");
    const closeFiltersBtn = document.querySelector(".filters-close");

    /* ============================
       SCROLL BUTTON
    ============================ */

    if (btnUp) {
        window.addEventListener("scroll", () => {
            btnUp.classList.toggle("show", window.scrollY > 50);
        });

        btnUp.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    /* ============================
       FILTER DRAWER
    ============================ */

    if (openFiltersBtn && filtersDrawer) {
        openFiltersBtn.addEventListener("click", () => {
            filtersDrawer.classList.add("is-open");
        });
    }

    if (closeFiltersBtn && filtersDrawer) {
        closeFiltersBtn.addEventListener("click", () => {
            filtersDrawer.classList.remove("is-open");
        });
    }

    document.addEventListener("click", e => {
        if (
            filtersDrawer &&
            filtersDrawer.classList.contains("is-open") &&
            !filtersDrawer.contains(e.target) &&
            !openFiltersBtn.contains(e.target)
        ) {
            filtersDrawer.classList.remove("is-open");
        }
    });
}
