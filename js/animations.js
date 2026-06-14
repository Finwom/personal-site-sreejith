document.addEventListener("DOMContentLoaded", () => {
	const revealItems = document.querySelectorAll(".reveal");

	if (!revealItems.length) {
		return;
	}

	if (!("IntersectionObserver" in window)) {
		revealItems.forEach((item) => item.classList.add("is-visible"));
		return;
	}

	const observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.classList.add("is-visible");
				observer.unobserve(entry.target);
			}
		});
	}, {
		threshold: 0.18,
	});

	revealItems.forEach((item) => observer.observe(item));
});


/* ========================= */
/* COUNTER ANIMATION */
/* ========================= */

document.addEventListener("DOMContentLoaded", () => {
	const counters = document.querySelectorAll(".counter");

	if (!counters.length) {
		return;
	}

	if (!("IntersectionObserver" in window)) {
		counters.forEach((counter) => {
			const target = parseInt(counter.dataset.target, 10);
			if (!isNaN(target)) {
				counter.textContent = target;
			}
		});
		return;
	}

	const counterObserver = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				const counter = entry.target;
				const target = parseInt(counter.dataset.target, 10);
				const duration = 2000;
				const increment = target / (duration / 16);
				let current = 0;

				const updateCounter = () => {
					current += increment;
					if (current < target) {
						counter.textContent = Math.floor(current);
						requestAnimationFrame(updateCounter);
					} else {
						counter.textContent = target;
					}
				};

				updateCounter();
				counterObserver.unobserve(counter);
			}
		});
	}, {
		threshold: 0.5,
	});

	counters.forEach((counter) => counterObserver.observe(counter));
});
