/* =====================================================================
   BOY CUT BARBERSHOP — SCRIPT
   Vanilla JS. No dependencies.
===================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("year").textContent = new Date().getFullYear();

  initNavbar();
  initMobileMenu();
  initScrollReveal();
  initCounters();
  initGallery();
  initTestimonialSlider();
  initBackToTop();
});

/* ---------------------------------------------------------------------
   1. Navbar: blur background after scroll, close mobile menu on nav click
--------------------------------------------------------------------- */
function initNavbar() {
  const nav = document.getElementById("nav");
  const toggleState = () => {
    nav.classList.toggle("is-scrolled", window.scrollY > 40);
  };
  toggleState();
  window.addEventListener("scroll", toggleState, { passive: true });
}

/* ---------------------------------------------------------------------
   2. Mobile hamburger menu
--------------------------------------------------------------------- */
function initMobileMenu() {
  const burger = document.getElementById("burgerBtn");
  const menu = document.getElementById("mobileMenu");

  const closeMenu = () => {
    burger.classList.remove("is-active");
    menu.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };

  burger.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("is-open");
    burger.classList.toggle("is-active", isOpen);
    burger.setAttribute("aria-expanded", String(isOpen));
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
}

/* ---------------------------------------------------------------------
   3. Scroll reveal — fade + slide up when elements enter viewport
--------------------------------------------------------------------- */
function initScrollReveal() {
  const items = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );
  items.forEach((item) => observer.observe(item));
}

/* ---------------------------------------------------------------------
   4. Animated stat counters — trigger once when stats section is visible
--------------------------------------------------------------------- */
function initCounters() {
  const nums = document.querySelectorAll(".stat__num");
  if (!nums.length) return;

  const animate = (el) => {
    const target = parseFloat(el.dataset.target);
    const decimals = parseInt(el.dataset.decimal || "0", 10);
    const suffix = el.dataset.suffix || "";
    const duration = 1600;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); /* ease-out cubic */
      const value = target * eased;
      el.textContent = value.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ".") + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  nums.forEach((num) => observer.observe(num));
}

/* ---------------------------------------------------------------------
   5. Gallery lightbox
--------------------------------------------------------------------- */
function initGallery() {
  const items = document.querySelectorAll(".gallery__item");
  const lightbox = document.getElementById("lightbox");
  const closeBtn = document.getElementById("lightboxClose");
  const caption = document.getElementById("lightboxCaption");
  if (!items.length || !lightbox) return;

  const open = (text) => {
    caption.textContent = text;
    lightbox.hidden = false;
    requestAnimationFrame(() => lightbox.classList.add("is-open"));
    document.body.style.overflow = "hidden";
  };
  const close = () => {
    lightbox.classList.remove("is-open");
    document.body.style.overflow = "";
    setTimeout(() => (lightbox.hidden = true), 300);
  };

  items.forEach((item) => {
    item.addEventListener("click", () => open(item.dataset.caption || ""));
  });
  closeBtn.addEventListener("click", close);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("is-open")) close();
  });
}

/* ---------------------------------------------------------------------
   6. Testimonial ticket slider — auto-advance + manual dots
--------------------------------------------------------------------- */
function initTestimonialSlider() {
  const slider = document.getElementById("ticketSlider");
  const dotsWrap = document.getElementById("ticketDots");
  if (!slider || !dotsWrap) return;

  const tickets = Array.from(slider.querySelectorAll(".ticket"));
  let current = 0;
  let timer = null;

  tickets.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.setAttribute("aria-label", `Ver testimonio ${i + 1}`);
    if (i === 0) dot.classList.add("is-active");
    dot.addEventListener("click", () => goTo(i, true));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function goTo(index, isManual) {
    tickets[current].classList.remove("is-active");
    dots[current].classList.remove("is-active");
    current = index;
    tickets[current].classList.add("is-active");
    dots[current].classList.add("is-active");
    if (isManual) restartAutoplay();
  }

  function next() {
    goTo((current + 1) % tickets.length, false);
  }

  function restartAutoplay() {
    clearInterval(timer);
    timer = setInterval(next, 6000);
  }

  restartAutoplay();
}

/* ---------------------------------------------------------------------
   7. Back to top button
--------------------------------------------------------------------- */
function initBackToTop() {
  const btn = document.getElementById("backToTop");
  if (!btn) return;

  window.addEventListener(
    "scroll",
    () => btn.classList.toggle("is-visible", window.scrollY > 700),
    { passive: true }
  );
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}
