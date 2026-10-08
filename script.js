/* ============================================================
   SZC — Software designed. Software built.
   script.js · site behaviour
   Founded and developed by Shaaz Zakariya C.
   ============================================================ */

(() => {
  "use strict";

  document.documentElement.classList.add("js");

  const body = document.body;
  const motionOK = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------
     Site is permanently light theme.
     --------------------------------------------------------- */
  /* ---------------------------------------------------------
     2. Reveal on scroll
     --------------------------------------------------------- */
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
  } else {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible"));
  }

  /* ---------------------------------------------------------
     3. Nav highlight on scroll
     --------------------------------------------------------- */
  const sectionIds = [
    "about", "work", "capabilities", "areas",
    "technology", "philosophy", "why-szc", "contact"
  ];
  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  const navLinks = Array.from(document.querySelectorAll(".nav a"));

  const updateChrome = () => {
    const mid = window.scrollY + window.innerHeight * 0.4;
    let current = 0;
    sections.forEach((sec, i) => { if (sec.offsetTop <= mid) current = i; });

    navLinks.forEach((a) => {
      const id = a.getAttribute("href");
      a.classList.toggle("active", !!id && id === "#" + sectionIds[current]);
    });
  };

  /* ---------------------------------------------------------
     4. Card tilt (pointer, fine pointers only)
     --------------------------------------------------------- */
  if (window.matchMedia("(pointer: fine)").matches && motionOK) {
    document.querySelectorAll("[data-tilt]").forEach((card) => {
      card.style.transition = "transform .35s cubic-bezier(.2,.75,.2,1)";
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transition = "transform .08s linear";
        card.style.transform =
          `perspective(1100px) rotateY(${px * 7}deg) rotateX(${-py * 7}deg) translateZ(6px)`;
      });
      card.addEventListener("pointerleave", () => {
        card.style.transition = "transform .55s cubic-bezier(.2,.75,.2,1)";
        card.style.transform = "perspective(1100px) rotateY(0) rotateX(0) translateZ(0)";
      });
    });
  }

  /* ---------------------------------------------------------
     5. Request modal → WhatsApp preview flow
     --------------------------------------------------------- */
  const requestModal = document.getElementById("requestModal");
  const requestForm = document.getElementById("requestForm");
  const requestFormStep = document.getElementById("requestFormStep");
  const requestPreviewStep = document.getElementById("requestPreviewStep");
  const whatsappPreview = document.getElementById("whatsappPreview");
  const editRequest = document.getElementById("editRequest");
  const proceedWhatsApp = document.getElementById("proceedWhatsApp");

  let whatsappMessage = "";
  let lastFocused = null;

  const openModal = (modal) => {
    if (!modal) return;
    lastFocused = document.activeElement;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    body.classList.add("modal-open");

    requestFormStep?.removeAttribute("hidden");
    requestPreviewStep?.setAttribute("hidden", "");
    whatsappMessage = "";

    const firstField = modal.querySelector("input, select, textarea");
    if (firstField) setTimeout(() => firstField.focus(), 80);
  };

  const closeModal = (modal) => {
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    body.classList.remove("modal-open");
    if (lastFocused instanceof HTMLElement) lastFocused.focus();
  };

  document.getElementById("requestNav")?.addEventListener("click", () => openModal(requestModal));
  document.getElementById("requestContact")?.addEventListener("click", () => openModal(requestModal));
  document.querySelectorAll("[data-open-request]").forEach((btn) => {
    btn.addEventListener("click", () => openModal(requestModal));
  });

  document.querySelectorAll("[data-close-modal]").forEach((button) => {
    button.addEventListener("click", () => closeModal(button.closest(".modal-backdrop")));
  });

  requestModal?.addEventListener("click", (event) => {
    if (event.target === requestModal) closeModal(requestModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && requestModal?.classList.contains("open")) {
      closeModal(requestModal);
    }
  });

  requestForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("requestName")?.value.trim();
    const type = document.getElementById("requestType")?.value;
    const message = document.getElementById("requestMessage")?.value.trim();

    if (!name || !message) return;

    whatsappMessage = [
      "Hello Shaaz Zakariya C,",
      "",
      "I would like to discuss a project with SZC.",
      "",
      `Name: ${name}`,
      `Project needed: ${type}`,
      `Project details: ${message}`,
      "",
      "Sent from the SZC website."
    ].join("\n");

    if (whatsappPreview) whatsappPreview.textContent = whatsappMessage;

    requestFormStep?.setAttribute("hidden", "");
    requestPreviewStep?.removeAttribute("hidden");

    setTimeout(() => proceedWhatsApp?.focus(), 80);
  });

  editRequest?.addEventListener("click", () => {
    requestPreviewStep?.setAttribute("hidden", "");
    requestFormStep?.removeAttribute("hidden");
    document.getElementById("requestName")?.focus();
  });

  proceedWhatsApp?.addEventListener("click", () => {
    if (!whatsappMessage) return;
    const whatsappNumber = "919400540669";
    window.location.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    closeModal(requestModal);
  });

  /* ---------------------------------------------------------
     6. Init
     --------------------------------------------------------- */
  updateChrome();
  window.addEventListener("scroll", updateChrome, { passive: true });
  window.addEventListener("resize", updateChrome);
  window.addEventListener("load", updateChrome);
})();

