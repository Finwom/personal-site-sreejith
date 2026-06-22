document.addEventListener("DOMContentLoaded", () => {
    const gallery = document.querySelector("[data-photo-gallery]");

    if (!gallery) {
        return;
    }

    const track = gallery.querySelector(".photo-gallery-track");
    const imageDirectory = "assets/photo-slide/";
    const cloneCount = 2;
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let slides = [];
    let currentIndex = cloneCount;
    let timer = 0;
    let isHovered = false;
    let pointerStart = 0;
    let dragOffset = 0;
    let isDragging = false;

    function removeGallerySection() {
        gallery.closest(".photo-gallery-section")?.remove();
    }

    const filenames = Array.isArray(window.PHOTO_GALLERY_IMAGES)
        ? window.PHOTO_GALLERY_IMAGES
        : [];
    const supportedImage = /\.(?:jpe?g|png|webp)$/i;
    const images = filenames.filter((filename) => supportedImage.test(filename));

    if (!images.length) {
        removeGallerySection();
        return;
    }

    const loopImages = images.length > 1
        ? [...images.slice(-cloneCount), ...images, ...images.slice(0, cloneCount)]
        : images;

    loopImages.forEach((filename) => {
        const card = document.createElement("div");
        const image = document.createElement("img");
        card.className = "photo-gallery-card";
        image.src = imageDirectory + filename.split("/").map(encodeURIComponent).join("/");
        image.alt = "";
        image.loading = "lazy";
        image.decoding = "async";
        image.draggable = false;
        card.appendChild(image);
        track.appendChild(card);
    });

    slides = Array.from(track.children);
    currentIndex = images.length > 1 ? cloneCount : 0;
    update(false);

    if (images.length > 1) {
        startTimer();
    }

    function trackPosition(offset = 0) {
        const card = slides[currentIndex];
        if (!card) {
            return 0;
        }

        return (gallery.clientWidth / 2) - card.offsetLeft - (card.offsetWidth / 2) + offset;
    }

    function update(animate = true, offset = 0) {
        track.style.transition = animate
            ? "transform 800ms cubic-bezier(0.22, 1, 0.36, 1)"
            : "none";
        track.style.transform = `translate3d(${trackPosition(offset)}px, 0, 0)`;

        slides.forEach((slide, index) => {
            const distance = Math.abs(index - currentIndex);
            slide.classList.toggle("is-active", distance === 0);
            slide.classList.toggle("is-near", distance === 1);
        });
    }

    function move(direction) {
        if (slides.length < 2) {
            return;
        }

        currentIndex += direction;
        update(true);
    }

    function startTimer() {
        window.clearInterval(timer);
        timer = window.setInterval(() => {
            if (!isHovered && !isDragging && document.visibilityState === "visible") {
                move(1);
            }
        }, 2800);
    }

    track.addEventListener("transitionend", (event) => {
        if (event.propertyName !== "transform") {
            return;
        }

        const realSlideCount = slides.length - (cloneCount * 2);

        if (currentIndex >= realSlideCount + cloneCount) {
            currentIndex = cloneCount;
            update(false);
        } else if (currentIndex < cloneCount) {
            currentIndex = realSlideCount + cloneCount - 1;
            update(false);
        }
    });

    if (canHover) {
        gallery.addEventListener("mouseenter", () => {
            isHovered = true;
            window.clearInterval(timer);
        });

        gallery.addEventListener("mouseleave", () => {
            isHovered = false;
            startTimer();
        });
    }

    gallery.addEventListener("pointerdown", (event) => {
        if (slides.length < 2) {
            return;
        }

        pointerStart = event.clientX;
        dragOffset = 0;
        isDragging = true;
        gallery.classList.add("is-dragging");
        gallery.setPointerCapture(event.pointerId);
        track.style.transition = "none";
    });

    gallery.addEventListener("pointermove", (event) => {
        if (!isDragging) {
            return;
        }

        dragOffset = event.clientX - pointerStart;
        track.style.transform = `translate3d(${trackPosition(dragOffset)}px, 0, 0)`;
    });

    function endDrag(event) {
        if (!isDragging) {
            return;
        }

        isDragging = false;
        gallery.classList.remove("is-dragging");

        if (gallery.hasPointerCapture(event.pointerId)) {
            gallery.releasePointerCapture(event.pointerId);
        }

        const threshold = Math.min(90, gallery.clientWidth * 0.16);
        if (Math.abs(dragOffset) > threshold) {
            move(dragOffset < 0 ? 1 : -1);
        } else {
            update(true);
        }
        startTimer();
    }

    gallery.addEventListener("pointerup", endDrag);
    gallery.addEventListener("pointercancel", endDrag);
    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
            startTimer();
        } else {
            window.clearInterval(timer);
        }
    });
    window.addEventListener("resize", () => update(false), { passive: true });
});
