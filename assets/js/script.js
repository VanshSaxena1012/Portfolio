const root = document.documentElement;
const body = document.body;
const themeToggle = document.getElementById("theme-toggle");
const preloader = document.getElementById("preloader");
const mobileMenuBtn = document.getElementById("mobile-menu-btn");
const mobileMenu = document.getElementById("mobile-menu");
const navLinks = [...document.querySelectorAll(".nav-link")];
const sections = [...document.querySelectorAll("main section[id]")];
const scrollTopBtn = document.getElementById("scroll-top-btn");
const contactForm = document.getElementById("contact-form");
const formMessage = document.getElementById("form-message");
const typingText = document.getElementById("typing-text");
const follower = document.querySelector(".pointer-follower");

const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const savedTheme = localStorage.getItem("theme");
const initialTheme = savedTheme || (prefersDark ? "dark" : "light");

setTheme(initialTheme);

function setTheme(theme) {
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

themeToggle?.addEventListener("click", () => {
  const isDark = root.classList.contains("dark");
  const nextTheme = isDark ? "light" : "dark";
  setTheme(nextTheme);
  localStorage.setItem("theme", nextTheme);
});

window.addEventListener("load", () => {
  setTimeout(() => preloader?.classList.add("hidden"), 500);
});

mobileMenuBtn?.addEventListener("click", () => {
  const isOpen = !mobileMenu.classList.contains("hidden");
  mobileMenu.classList.toggle("hidden");
  mobileMenuBtn.setAttribute("aria-expanded", String(!isOpen));
});

document.querySelectorAll(".mobile-link").forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.add("hidden");
    mobileMenuBtn.setAttribute("aria-expanded", "false");
  });
});

function setActiveLink() {
  const offset = window.scrollY + 120;
  let currentSection = sections[0]?.id || "home";

  sections.forEach((section) => {
    if (offset >= section.offsetTop) {
      currentSection = section.id;
    }
  });

  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${currentSection}`;
    link.classList.toggle("active", isActive);
  });
}

function toggleScrollTopButton() {
  scrollTopBtn.classList.toggle("show", window.scrollY > 500);
}

window.addEventListener("scroll", () => {
  setActiveLink();
  toggleScrollTopButton();
});

scrollTopBtn?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

const words = ["Frontend Developer", "UI/UX Enthusiast", "Performance Optimizer"];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeLoop() {
  const currentWord = words[wordIndex];
  typingText.textContent = isDeleting
    ? currentWord.substring(0, charIndex--)
    : currentWord.substring(0, charIndex++);

  if (!isDeleting && charIndex === currentWord.length + 1) {
    isDeleting = true;
    setTimeout(typeLoop, 1300);
    return;
  }

  if (isDeleting && charIndex < 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length;
  }

  setTimeout(typeLoop, isDeleting ? 45 : 85);
}

typeLoop();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(contactForm);
  const name = String(data.get("name") || "").trim();
  const email = String(data.get("email") || "").trim();
  const message = String(data.get("message") || "").trim();

  if (!name || !email || !message) {
    formMessage.textContent = "Please fill out all fields.";
    formMessage.className = "mt-4 text-sm text-rose-500";
    return;
  }

  if (!emailRegex.test(email)) {
    formMessage.textContent = "Please enter a valid email address.";
    formMessage.className = "mt-4 text-sm text-rose-500";
    return;
  }

  formMessage.textContent = "Thanks! Your message is ready to send.";
  formMessage.className = "mt-4 text-sm text-emerald-500";
  contactForm.reset();
});

window.addEventListener("mousemove", (event) => {
  if (!follower) return;
  follower.classList.remove("hidden");
  follower.style.left = `${event.clientX}px`;
  follower.style.top = `${event.clientY}px`;
});

window.addEventListener("mouseout", () => {
  follower?.classList.add("hidden");
});

document.querySelectorAll("a, button, .project-card, .service-card").forEach((el) => {
  el.addEventListener("mouseenter", () => {
    if (!follower) return;
    follower.style.width = "2rem";
    follower.style.height = "2rem";
  });
  el.addEventListener("mouseleave", () => {
    if (!follower) return;
    follower.style.width = "1.2rem";
    follower.style.height = "1.2rem";
  });
});

if (window.gsap) {
  gsap.registerPlugin(ScrollTrigger);

  gsap.from("#home .reveal", {
    y: 34,
    opacity: 0,
    duration: 0.9,
    stagger: 0.12,
    ease: "power3.out",
    delay: 0.18,
  });

  gsap.utils.toArray(".reveal").forEach((element) => {
    if (element.closest("#home")) return;
    gsap.from(element, {
      scrollTrigger: {
        trigger: element,
        start: "top 84%",
      },
      y: 28,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
    });
  });

  gsap.utils.toArray("#skills .skill-row").forEach((row) => {
    const value = row.dataset.progress || 0;
    const bar = row.nextElementSibling?.querySelector("span");
    if (!bar) return;

    gsap.to(bar, {
      width: `${value}%`,
      ease: "power2.out",
      duration: 1,
      scrollTrigger: {
        trigger: row,
        start: "top 85%",
      },
    });
  });

  gsap.from("#projects .project-card", {
    scrollTrigger: {
      trigger: "#projects",
      start: "top 70%",
    },
    y: 28,
    opacity: 0,
    stagger: 0.15,
    duration: 0.8,
    ease: "power2.out",
  });
}

setActiveLink();
toggleScrollTopButton();
