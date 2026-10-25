(() => {
  "use strict";

  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- Countdown ---------- */
  const weddingDate = new Date(2027, 7, 15, 16, 0, 0);
  const countdown = {
    days: $('[data-countdown="days"]'),
    hours: $('[data-countdown="hours"]'),
    minutes: $('[data-countdown="minutes"]'),
    seconds: $('[data-countdown="seconds"]'),
  };

  const pad = (value) => String(value).padStart(2, "0");

  const setValue = (node, value) => {
    if (node && node.textContent !== value) {
      node.textContent = value;
    }
  };

  const updateCountdown = () => {
    const distance = weddingDate.getTime() - Date.now();

    if (distance <= 0) {
      setValue(countdown.days, "00");
      setValue(countdown.hours, "00");
      setValue(countdown.minutes, "00");
      setValue(countdown.seconds, "00");
      return;
    }

    const days = Math.floor(distance / 86_400_000);
    const hours = Math.floor((distance / 3_600_000) % 24);
    const minutes = Math.floor((distance / 60_000) % 60);
    const seconds = Math.floor((distance / 1_000) % 60);

    setValue(countdown.days, String(days).padStart(2, "0"));
    setValue(countdown.hours, pad(hours));
    setValue(countdown.minutes, pad(minutes));
    setValue(countdown.seconds, pad(seconds));
  };

  updateCountdown();
  window.setInterval(updateCountdown, 1_000);

  /* ---------- Header ---------- */
  const header = $("#header");
  const heroBg = $(".hero__bg");
  const closing = $(".closing");

  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);

    if (closing) {
      const closingTop = closing.offsetTop - header.offsetHeight;
      header.classList.toggle("is-dark", window.scrollY >= closingTop);
    }
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Staggered reveals ---------- */
  $$(".details__grid, .location__content, .invitation__body, .dresscode__content").forEach(
    (group) => {
      const items = Array.from(group.children).filter((el) => el.classList.contains("reveal"));
      items.forEach((item, index) => {
        item.style.setProperty("--reveal-delay", `${Math.min(index * 0.08, 0.32)}s`);
      });
    },
  );

  /* ---------- Reveal on scroll ---------- */
  const revealItems = $$(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  /* ---------- Active navigation ---------- */
  const navLinks = $$(".nav a");
  const linkedSections = navLinks
    .map((link) => $(link.getAttribute("href")))
    .filter(Boolean);

  let navTicking = false;

  const updateActiveNav = () => {
    navTicking = false;
    const marker = window.scrollY + window.innerHeight * 0.33;
    let activeId = null;

    linkedSections.forEach((section) => {
      if (marker >= section.offsetTop && marker < section.offsetTop + section.offsetHeight) {
        activeId = section.id;
      }
    });

    navLinks.forEach((link) => {
      if (activeId && link.hash === `#${activeId}`) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  const requestNavUpdate = () => {
    if (navTicking) return;
    navTicking = true;
    window.requestAnimationFrame(updateActiveNav);
  };

  updateActiveNav();
  window.addEventListener("scroll", requestNavUpdate, { passive: true });
  window.addEventListener("resize", requestNavUpdate, { passive: true });

  /* ---------- Gentle hero parallax ---------- */
  let parallaxEnabled = !reduceMotion.matches;

  const updateParallax = () => {
    if (!heroBg || !parallaxEnabled) return;
    const offset = Math.min(window.scrollY, window.innerHeight) * 0.1;
    heroBg.style.transform = `translate3d(0, ${offset}px, 0)`;
  };

  if (heroBg && parallaxEnabled) {
    let parallaxTicking = false;

    window.addEventListener(
      "scroll",
      () => {
        if (parallaxTicking) return;
        parallaxTicking = true;
        window.requestAnimationFrame(() => {
          parallaxTicking = false;
          updateParallax();
        });
      },
      { passive: true },
    );
  }

  if (typeof reduceMotion.addEventListener === "function") {
    reduceMotion.addEventListener("change", (event) => {
      parallaxEnabled = !event.matches;
      if (!parallaxEnabled && heroBg) {
        heroBg.style.transform = "";
      }
    });
  }
})();
