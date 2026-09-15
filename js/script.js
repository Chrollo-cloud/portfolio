/* ==========================================================
   1. DARK MODE TOGGLE
   ========================================================== */
function initDarkMode() {
  const toggleBtn = document.getElementById("theme-toggle");
  const html = document.documentElement;

  // Apply saved preference on load
  const saved = localStorage.getItem("theme");
  if (saved === "dark") {
    html.classList.add("dark");
  }
  updateToggleState();

  toggleBtn?.addEventListener("click", () => {
    html.classList.toggle("dark");
    const isDark = html.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    updateToggleState();
  });

  function updateToggleState() {
    if (!toggleBtn) return;
    const isDark = html.classList.contains("dark");
    toggleBtn.textContent = "TOGGLE";
    toggleBtn.setAttribute("aria-pressed", String(isDark));
  }
}

/* ==========================================================
   2. MOBILE MENU TOGGLE
   ========================================================== */
function initMobileMenu() {
  const menuBtn = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");

  menuBtn?.addEventListener("click", () => {
    mobileMenu?.classList.toggle("hidden");
    const isOpen = !mobileMenu?.classList.contains("hidden");
    menuBtn.textContent = "MENU";
    menuBtn.setAttribute("aria-expanded", String(isOpen));
  });
}

/* ==========================================================
   3. PROJECT FILTER (only runs on projects.html)
   ========================================================== */
function initProjectFilter() {
  const filterBtns = document.querySelectorAll("[data-filter]");
  const projectCards = document.querySelectorAll("[data-category]");

  if (filterBtns.length === 0) return;

  const categoryAliases = {
    "ui/ux": "design",
    ux: "design",
    ui: "design",
    figma: "design",
    prototype: "design",
    design: "design",
    cybersecurity: "security",
    security: "security",
    ctf: "security",
    web: "web",
    website: "web",
    html: "web",
    css: "web",
    software: "software",
    programming: "software",
    application: "software",
    app: "software",
    network: "software",
    other: "other",
  };

  function normalizeCategories(card) {
    const rawCategories = [
      card.getAttribute("data-category"),
      card.getAttribute("data-category-label"),
      card.getAttribute("data-tags"),
    ]
      .filter(Boolean)
      .join(" ");

    const normalized = rawCategories
      .toLowerCase()
      .split(/[\s,/|]+/)
      .map((category) => categoryAliases[category] || category)
      .filter(Boolean);

    return new Set(normalized);
  }

  const cardCategoryMap = new Map();
  projectCards.forEach((card) => {
    cardCategoryMap.set(card, normalizeCategories(card));
  });

  function setActiveFilter(activeBtn) {
    filterBtns.forEach((btn) => {
      const isActive = btn === activeBtn;

      btn.classList.toggle("bg-pink", isActive);
      btn.classList.toggle("text-white", isActive);
      btn.classList.toggle("bg-card", !isActive);
      btn.classList.toggle("dark:bg-card-dark", !isActive);
      btn.setAttribute("aria-pressed", String(isActive));
    });
  }

  function applyFilter(filter) {
    projectCards.forEach((card) => {
      const categories = cardCategoryMap.get(card) || new Set();
      const shouldShow = filter === "all" || categories.has(filter);

      card.classList.toggle("project-card-hidden", !shouldShow);
      card.toggleAttribute("hidden", !shouldShow);
    });
  }

  filterBtns.forEach((btn) => {
    btn.setAttribute("type", "button");

    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter");

      setActiveFilter(btn);
      applyFilter(filter);
    });
  });
}

/* ==========================================================
   3b. PROJECT DETAIL MODAL (pop-up card)
   ========================================================== */
function initProjectModal() {
  const modal = document.getElementById("project-modal");
  if (!modal) return;

  const modalTitle = document.getElementById("modal-title");
  const modalDesc = document.getElementById("modal-desc");
  const modalTags = document.getElementById("modal-tags");
  const modalCategory = document.getElementById("modal-category");
  const modalImage = document.getElementById("modal-image");
  const modalImageFallback = document.getElementById("modal-image-fallback");
  const modalProjectLink = document.getElementById("modal-project-link");
  const closeBtn = document.getElementById("modal-close");

  document.querySelectorAll("[data-open-modal]").forEach((card) => {
    card.addEventListener("click", (e) => {
      if (e.target.closest("a")) return;

      const title = card.getAttribute("data-title") || "Project";
      const image = card.getAttribute("data-image") || "";
      const projectLink = card.getAttribute("data-project-link") || "";

      modalTitle.textContent = title;
      modalDesc.textContent = card.getAttribute("data-desc") || "";
      modalCategory.textContent = card.getAttribute("data-category-label") || "";

      if (image) {
        modalImage.src = image;
        modalImage.alt = `${title} preview`;
        modalImage.classList.remove("hidden");
        modalImageFallback.classList.add("hidden");
      } else {
        modalImage.removeAttribute("src");
        modalImage.alt = "";
        modalImage.classList.add("hidden");
        modalImageFallback.classList.remove("hidden");
      }

      if (projectLink) {
        modalProjectLink.href = projectLink;
        modalProjectLink.textContent =
          card.getAttribute("data-link-label") || "OPEN PROJECT";
        modalProjectLink.classList.remove("hidden");
      } else {
        modalProjectLink.removeAttribute("href");
        modalProjectLink.classList.add("hidden");
      }

      modalTags.innerHTML = "";
      (card.getAttribute("data-tags") || "").split(",").forEach((tag) => {
        if (!tag.trim()) return;
        const span = document.createElement("span");
        span.textContent = tag.trim();
        span.className =
          "text-xs px-2 py-1 bg-pink text-white pixel-border font-pixel";
        modalTags.appendChild(span);
      });

      modal.classList.remove("hidden");
      document.body.classList.add("overflow-hidden");
    });
  });

  modalImage?.addEventListener("error", () => {
    modalImage.classList.add("hidden");
    modalImageFallback?.classList.remove("hidden");
  });

  function closeModal() {
    modal.classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
  }

  closeBtn?.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
}

/* ==========================================================
   3c. CERTIFICATE LIGHTBOX (only runs when certificate cards exist)
   ========================================================== */
function initCertificateLightbox() {
  const modal = document.getElementById("certificate-modal");
  if (!modal) return;

  const modalImage = document.getElementById("certificate-modal-image");
  const modalTitle = document.getElementById("certificate-modal-title");
  const modalFallback = document.getElementById("certificate-modal-fallback");
  const closeBtn = document.getElementById("certificate-modal-close");

  function showFallback() {
    modalImage?.classList.add("hidden");
    modalFallback?.classList.remove("hidden");
  }

  function prepareImageFallback(img) {
    let fallback = img.nextElementSibling;

    if (!fallback || !fallback.hasAttribute("data-certificate-fallback")) {
      fallback = document.createElement("span");
      fallback.setAttribute("data-certificate-fallback", "");
      fallback.className = "hidden text-center font-bold px-4 text-navy-light";
      fallback.textContent = "Certificate image placeholder";
      img.insertAdjacentElement("afterend", fallback);
    }

    function showCardFallback() {
      img.classList.add("hidden");
      fallback.classList.remove("hidden");
    }

    img.addEventListener("error", showCardFallback);
    if (img.complete && img.naturalWidth === 0) {
      showCardFallback();
    }
  }

  document.querySelectorAll("[data-certificate] img").forEach(prepareImageFallback);

  document.querySelectorAll("[data-certificate]").forEach((certificate) => {
    certificate.addEventListener("click", () => {
      const src = certificate.getAttribute("data-src");
      const title = certificate.getAttribute("data-title") || "Certificate";

      if (!modalImage || !modalTitle) return;

      modalTitle.textContent = title;
      modalFallback?.classList.add("hidden");
      modalImage.classList.remove("hidden");
      modalImage.src = src || "";
      modalImage.alt = title;

      modal.classList.remove("hidden");
      document.body.classList.add("overflow-hidden");
    });
  });

  modalImage?.addEventListener("error", showFallback);

  function closeModal() {
    modal.classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
  }

  closeBtn?.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
}

/* ==========================================================
   4. CONTACT FORM VALIDATION (only runs on contact.html)
   ========================================================== */
function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const successBox = document.getElementById("form-success");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let isValid = true;

    const fields = [
      { id: "name", errorId: "name-error", message: "Please enter your name." },
      { id: "email", errorId: "email-error", message: "Please enter a valid email." },
      { id: "message", errorId: "message-error", message: "Please enter a message." },
    ];

    fields.forEach(({ id, errorId, message }) => {
      const input = document.getElementById(id);
      const errorEl = document.getElementById(errorId);
      let fieldValid = input.value.trim() !== "";

      if (id === "email" && fieldValid) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        fieldValid = emailPattern.test(input.value.trim());
      }

      if (!fieldValid) {
        isValid = false;
        errorEl.textContent = message;
        errorEl.classList.remove("hidden");
        input.classList.add("border-pink-dark");
      } else {
        errorEl.classList.add("hidden");
        input.classList.remove("border-pink-dark");
      }
    });

    if (isValid) {
      successBox.classList.remove("hidden");
      form.reset();
      setTimeout(() => successBox.classList.add("hidden"), 4000);
    } else {
      successBox.classList.add("hidden");
    }
  });
}

/* ==========================================================
   INIT ALL
   ========================================================== */
document.addEventListener("DOMContentLoaded", () => {
  initDarkMode();
  initMobileMenu();
  initProjectFilter();
  initProjectModal();
  initCertificateLightbox();
  initContactForm();
});
