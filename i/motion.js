(() => {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const revealSpecs = [
    [".hero-copy > .eyebrow", "hero", 0],
    [".hero-copy h1", "hero", 70],
    [".hero-text", "hero", 140],
    [".hero-actions", "hero", 210],
    [".coming-soon", "panel", 80],
    [".stats", "panel", 100],
    [".history-suite > .suite-copy", "panel", 0],
    [".history-suite > .suite-showcase", "panel", 80],
    [".history-editions a", "item", 0, 38, 260],
    ["#apps .section-heading", "section", 0],
    ["#apps .app-card", "card", 0, 55, 330],
    [".privacy-hero-copy > *", "section", 0, 70, 210],
    [".privacy-status-panel", "panel", 120],
    [".privacy-statement", "card", 0, 60, 180],
    [".privacy-index", "section", 0],
    [".privacy-section", "section", 0, 45, 225],
    [".privacy-contact", "card", 80],
    [".site-footer .footer-row", "section", 0],
    [".footer-illustration", "ambient", 90],
  ];

  const revealItems = [];

  revealSpecs.forEach(([selector, type, baseDelay = 0, step = 0, maxDelay = 0]) => {
    document.querySelectorAll(selector).forEach((element, index) => {
      if (element.hasAttribute("data-reveal")) {
        return;
      }

      const delay = baseDelay + (step ? Math.min(index * step, maxDelay) : 0);
      element.dataset.reveal = type;
      element.style.setProperty("--reveal-delay", `${delay}ms`);
      revealItems.push(element);
    });
  });

  if (!revealItems.length) {
    return;
  }

  const show = (element) => {
    element.classList.add("is-visible");
  };

  if (reduceMotion.matches || !("IntersectionObserver" in window)) {
    revealItems.forEach(show);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        show(entry.target);
        observer.unobserve(entry.target);
      });
    },
    {
      rootMargin: "0px 0px -8% 0px",
      threshold: 0.14,
    },
  );

  root.classList.add("reveal-ready");
  revealItems.forEach((element) => observer.observe(element));

  window.addEventListener("pagehide", () => observer.disconnect(), { once: true });
})();
