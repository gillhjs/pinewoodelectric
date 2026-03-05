// =====================================
// THEME TOGGLE (WITH PERSISTENCE)
// =====================================

const toggle = document.getElementById("themeToggle");

if (toggle) {
  // Load saved theme
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
  }

  toggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    // Save preference
    if (document.body.classList.contains("dark-mode")) {
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.setItem("theme", "light");
    }
  });
}


// =====================================
// HEADER SHADOW ON SCROLL
// =====================================

const header = document.querySelector(".header");

window.addEventListener("scroll", () => {
  if (window.scrollY > 20) {
    header.style.boxShadow = "0 10px 30px rgba(0,0,0,0.08)";
  } else {
    header.style.boxShadow = "none";
  }
});


// =====================================
// SMOOTH SCROLL FOR INTERNAL LINKS
// =====================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth"
      });
    }
  });
});


// =====================================
// FADE-IN ANIMATION ON SCROLL
// =====================================

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("fade-in-visible");
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll("section, .card, .service-card-pro, .value-card")
  .forEach(el => {
    el.classList.add("fade-in");
    observer.observe(el);
  });

  // MOBILE NAV TOGGLE
const hamburger = document.getElementById("hamburger");
const nav = document.getElementById("mainNav");

if (hamburger) {
  hamburger.addEventListener("click", () => {
    nav.classList.toggle("active");
  });
}