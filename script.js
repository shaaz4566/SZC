(() => {
  const body = document.body;
  const toggle = document.getElementById("themeToggle");
  const savedTheme = localStorage.getItem("szc-theme");

  if (savedTheme === "light") body.classList.add("light");

  if (toggle) {
    toggle.addEventListener("click", () => {
      body.classList.toggle("light");
      localStorage.setItem("szc-theme", body.classList.contains("light") ? "light" : "dark");
    });
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
  } else {
    document.querySelectorAll(".reveal").forEach((element) => element.classList.add("visible"));
  }

  const requestModal = document.getElementById("requestModal");
  const requestNav = document.getElementById("requestNav");
  const requestContact = document.getElementById("requestContact");
  const requestForm = document.getElementById("requestForm");
  const requestFormStep = document.getElementById("requestFormStep");
  const requestPreviewStep = document.getElementById("requestPreviewStep");
  const whatsappPreview = document.getElementById("whatsappPreview");
  const editRequest = document.getElementById("editRequest");
  const proceedWhatsApp = document.getElementById("proceedWhatsApp");

  let whatsappMessage = "";

  const openModal = (modal) => {
    if (!modal) return;
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
  };

  if (requestNav) requestNav.addEventListener("click", () => openModal(requestModal));
  if (requestContact) requestContact.addEventListener("click", () => openModal(requestModal));

  document.querySelectorAll("[data-close-modal]").forEach((button) => {
    button.addEventListener("click", () => closeModal(button.closest(".modal-backdrop")));
  });

  if (requestModal) {
    requestModal.addEventListener("click", (event) => {
      if (event.target === requestModal) closeModal(requestModal);
    });
  }

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

    if (whatsappPreview) {
      whatsappPreview.textContent = whatsappMessage;
    }

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
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

    // This is a direct user click, so the browser can navigate to WhatsApp reliably.
    window.location.href = url;
    closeModal(requestModal);
  });
})();
