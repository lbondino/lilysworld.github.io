// === FADE-IN (entrada suave) ===
document.addEventListener("DOMContentLoaded", () => {
  document.body.style.opacity = 0;
  setTimeout(() => {
    document.body.style.transition = "opacity 1.5s";
    document.body.style.opacity = 1;
  }, 100);
});

// === CARRUSELES INFINITOS ===
function initInfiniteCarousel(id) {
  const container = document.getElementById(id);
  if (!container) return; // si no existe en esta página, salta

  const track = container.querySelector(".carousel-track");
  const slides = Array.from(track.querySelectorAll("a"));
  const nextBtn = container.querySelector(".next");
  const prevBtn = container.querySelector(".prev");

  // Clonar primer y último slide sin duplicar atributos ARIA
  const firstClone = slides[0].cloneNode(true);
  const lastClone = slides[slides.length - 1].cloneNode(true);

  // Insertarlos primero en el DOM
  track.appendChild(firstClone);
  track.insertBefore(lastClone, slides[0]);

  // Asignar IDs después de insertarlos (para que el evento transitionend los detecte bien)
  firstClone.id = "first-clone";
  lastClone.id = "last-clone";

  // Limpiar atributos innecesarios
  [firstClone, lastClone].forEach(clone => {
    clone.removeAttribute("aria-label");
    clone.removeAttribute("role");
  });


  const allSlides = Array.from(track.querySelectorAll("a"));
  let index = 1;
  let slideWidth;

  function setInitialPosition() {
    slideWidth = allSlides[index].clientWidth;
    if (slideWidth === 0) {
      setTimeout(setInitialPosition, 100);
      return;
    }
    track.style.transition = "none";
    track.style.transform = `translateX(-${slideWidth * index}px)`;
  }

  window.addEventListener("resize", () => {
    slideWidth = allSlides[index].clientWidth;
    track.style.transition = "none";
    track.style.transform = `translateX(-${slideWidth * index}px)`;
  });

  function moveToNextSlide() {
    if (index >= allSlides.length - 1) return;
    index++;
    track.style.transition = "transform 0.5s ease-in-out";
    track.style.transform = `translateX(-${slideWidth * index}px)`;
  }

  function moveToPrevSlide() {
    if (index <= 0) return;
    index--;
    track.style.transition = "transform 0.5s ease-in-out";
    track.style.transform = `translateX(-${slideWidth * index}px)`;
  }

  track.addEventListener("transitionend", () => {
    if (allSlides[index].id === "first-clone") {
      track.style.transition = "none";
      index = 1;
      track.style.transform = `translateX(-${slideWidth * index}px)`;
    }
    if (allSlides[index].id === "last-clone") {
      track.style.transition = "none";
      index = allSlides.length - 2;
      track.style.transform = `translateX(-${slideWidth * index}px)`;
    }
  });

  nextBtn.addEventListener("click", () => {
    moveToNextSlide();
    restartAuto();
  });
  prevBtn.addEventListener("click", () => {
    moveToPrevSlide();
    restartAuto();
  });

  let autoSlide;
  function startAuto() {
    autoSlide = setInterval(moveToNextSlide, 4000);
  }
  function stopAuto() {
    clearInterval(autoSlide);
  }
  function restartAuto() {
    stopAuto();
    startAuto();
  }

  container.addEventListener("mouseenter", stopAuto);
  container.addEventListener("mouseleave", startAuto);

  // 🧩 Reintentar hasta que las imágenes lazy estén listas
  const observer = new MutationObserver(() => {
    const visible = Array.from(track.querySelectorAll("img"))
      .some(img => img.complete && img.clientWidth > 0);
    if (visible) {
      observer.disconnect();
      setInitialPosition();
      startAuto();
    }
  });
  observer.observe(track, { childList: true, subtree: true });

  // fallback si ya están listas
  window.addEventListener("load", () => {
    setTimeout(() => {
      setInitialPosition();
      startAuto();
    }, 300);
  });
}

// === INICIALIZAR ===
document.addEventListener("DOMContentLoaded", () => {
  const carouselIDs = [
    // Zazzle
    "carousel-seahorse", "carousel-dino", "carousel-shipping", "carousel-kitchen",
    "carousel-wrapping", "carousel-school", "carousel-lunchbox", "carousel-petmemorial",
    "carousel-mixed", "home-zazzle-carousel",

    // TeePublic
    "carousel-ai-mind", "carousel-tech", "carousel-logic", "carousel-funny",
    "carousel-yoga", "carousel-cute", "home-teepublic-carousel",

    // Redbubble
    "carousel-yoga-art", "carousel-kawaii-groovy", "carousel-digital-soul",
    "carousel-burnout-irony", "home-redbubble-carousel"
  ];

  carouselIDs.forEach(id => initInfiniteCarousel(id));
});

// === CARGAR HEADER Y FOOTER + MARCAR LINK ACTIVO ===
document.addEventListener("DOMContentLoaded", () => {
  // Cargar el header
  fetch("header.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("header").innerHTML = data;

      // Marcar el link activo después de que el header se inserta
      const current = window.location.pathname.split("/").pop().replace(".html", "").toLowerCase() || "index";
      document.querySelectorAll(".nav a").forEach(link => {
        const href = link.getAttribute("href").replace(".html", "").toLowerCase();
        if (href === current) {
          link.classList.add("active");
        }
      });
    });

  // Cargar el footer
  fetch("footer.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("footer").innerHTML = data;
    });
});
