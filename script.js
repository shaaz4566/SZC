(() => {
  "use strict";
  const toggle = document.getElementById("menuToggle");
  const nav = document.getElementById("siteNav");
  toggle?.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  });
  nav?.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    nav.classList.remove("open");
    toggle?.setAttribute("aria-expanded", "false");
    toggle?.setAttribute("aria-label", "Open navigation");
  }));
  const anchors = [...document.querySelectorAll('.nav a[href^="#"]')];
  const sections = anchors.map(a => document.querySelector(a.getAttribute("href"))).filter(Boolean);
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          anchors.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id));
        }
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    sections.forEach(section => observer.observe(section));
  }
})();