
const desktopProfessions = [

    "Author",
    "Management Consultant",
    "Cultural & Literary Influencer"

];

const mobileProfessions = [

    "Author",
    "Management Consultant",
    "Cultural & Literary Influencer"

];

const professions = window.matchMedia("(max-width: 600px)").matches ? mobileProfessions : desktopProfessions;

let professionIndex = 0;

const professionElement = document.getElementById("profession");
const navbar = document.querySelector(".navbar");
const menuButton = document.querySelector(".menu-btn");

function scrollToSection(selector) {
    const target = document.querySelector(selector);

    if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}


function changeProfession(){

    if (!professionElement) {
        return;
    }

    professionElement.textContent = professions[professionIndex];

    professionIndex++;

    if(professionIndex >= professions.length){

        professionIndex = 0;
    }
}


/* INITIAL LOAD */

if (professionElement) {
    changeProfession();
}

document.querySelectorAll("[data-scroll]").forEach((button) => {
    button.addEventListener("click", () => scrollToSection(button.dataset.scroll));
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
        const target = link.getAttribute("href");

        if (!target || target === "#") {
            return;
        }

        event.preventDefault();
        scrollToSection(target);
        navbar?.classList.remove("is-open");
        menuButton?.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
        setTimeout(() => scrollToSection(target), 100);
    });
});

if (menuButton && navbar) {
    menuButton.addEventListener("click", () => {
        const isOpen = navbar.classList.toggle("is-open");
        menuButton.setAttribute("aria-expanded", String(isOpen));
        document.body.style.overflow = isOpen ? "hidden" : "";
    });
}


/* CHANGE EVERY 2 SECONDS */

if (professionElement) {
    setInterval(changeProfession, 2000);
}

const previewItems = document.querySelectorAll(".media-preview[data-preview-src]");

if (previewItems.length) {
    const modal = document.createElement("div");
    modal.className = "asset-modal";
    modal.setAttribute("aria-hidden", "true");
    modal.innerHTML = `
        <div class="asset-modal-panel" role="dialog" aria-modal="true" aria-label="Media preview">
            <button class="asset-modal-close" type="button" aria-label="Close preview">&times;</button>
            <img src="" alt="">
            <div class="asset-modal-title"></div>
        </div>
    `;

    document.body.appendChild(modal);

    const modalImage = modal.querySelector("img");
    const modalTitle = modal.querySelector(".asset-modal-title");
    const closeButton = modal.querySelector(".asset-modal-close");

    function openPreview(item) {
        modalImage.src = item.dataset.previewSrc;
        modalImage.alt = item.dataset.previewTitle || "Media preview";
        modalTitle.textContent = item.dataset.previewTitle || "";
        modal.classList.add("is-open");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
        closeButton.focus();
    }

    function closePreview() {
        modal.classList.remove("is-open");
        modal.setAttribute("aria-hidden", "true");
        modalImage.src = "";
        document.body.style.overflow = navbar?.classList.contains("is-open") ? "hidden" : "";
    }

    previewItems.forEach((item) => {
        item.addEventListener("click", () => openPreview(item));
        item.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openPreview(item);
            }
        });
    });

    closeButton.addEventListener("click", closePreview);
    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            closePreview();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && modal.classList.contains("is-open")) {
            closePreview();
        }
    });
}

document.querySelectorAll(".slider-btn[data-slider-target]").forEach((button) => {
    button.addEventListener("click", () => {
        const track = document.querySelector(button.dataset.sliderTarget);

        if (!track) {
            return;
        }

        const direction = Number(button.dataset.sliderDir) || 1;
        track.scrollBy({
            left: direction * Math.max(track.clientWidth * 0.82, 260),
            behavior: "smooth"
        });
    });
});
