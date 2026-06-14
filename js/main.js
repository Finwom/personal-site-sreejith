
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

