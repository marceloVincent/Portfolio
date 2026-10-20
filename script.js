(() => {
  "use strict";

  const root = document.documentElement;
  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canHover = window.matchMedia && window.matchMedia("(hover: hover)").matches;

  const SMOOTH_SCROLL = false;
  const PARALLAX = false;
  const INTRO = 0;

  try {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) root.setAttribute("data-theme", savedTheme);
  } catch (e) {}

  document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initMobileMenu();
    initSplitText();
    initTypewriter();
    initWelcome();
    initPageTransitions();
    initAlertButtons();
    initScrollEffects();
    initClock();
    initReadMore();
    initReveal();
    initCounters();
    initSkillBars();
    initContactForm();
    initImages();
    initCardEffects();
    initMagnetic();
    initRipple();
  });

  window.addEventListener("pageshow", (e) => {
    const wipe = document.getElementById("pageWipe");
    if (wipe && e.persisted) wipe.classList.remove("leaving");
  });

  const initTheme = () => {
    const btn = document.getElementById("themeToggle");
    if (!btn) return;
    const paint = () => {
      const isLight = root.getAttribute("data-theme") === "light";
      btn.innerHTML = isLight ? "&#9728;" : "&#9790;";
      btn.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");
    };
    paint();
    btn.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      paint();
    });
  };

  const initMobileMenu = () => {
    const toggle = document.getElementById("navToggle");
    const links = document.getElementById("navLinks");
    if (!toggle || !links) return;
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  };

  const initSplitText = () => {
    if (reduceMotion) return;
    document.querySelectorAll("[data-split]").forEach((el) => {
      const label = el.textContent.trim();
      let i = 0;
      const walk = (node) => {
        Array.from(node.childNodes).forEach((n) => {
          if (n.nodeType === 3) {
            const frag = document.createDocumentFragment();
            n.textContent.split(/(\s+)/).forEach((part) => {
              if (!part) return;
              if (/^\s+$/.test(part)) {
                frag.appendChild(document.createTextNode(" "));
                return;
              }
              const w = document.createElement("span");
              w.className = "word";
              w.setAttribute("aria-hidden", "true");
              const inner = document.createElement("span");
              inner.className = "word-in";
              inner.style.animationDelay = `${INTRO / 1000 + 0.1 + i * 0.08}s`;
              inner.textContent = part;
              w.appendChild(inner);
              frag.appendChild(w);
              i++;
            });
            n.parentNode.replaceChild(frag, n);
          } else if (n.nodeType === 1) {
            walk(n);
          }
        });
      };
      walk(el);
      el.setAttribute("aria-label", label);
    });
  };

  const initTypewriter = () => {
    const el = document.getElementById("typedText");
    if (!el) return;
    const words = ["BSIT Student", "Front-End Developer", "Future Full-Stack developer"];
    let w = 0, c = 0;
    let deleting = false;
    const tick = () => {
      const word = words[w];
      if (!deleting) {
        c++;
        el.textContent = word.slice(0, c);
        if (c === word.length) {
          deleting = true;
          return setTimeout(tick, 1400);
        }
        return setTimeout(tick, 90);
      }
      c--;
      el.textContent = word.slice(0, c);
      if (c === 0) {
        deleting = false;
        w = (w + 1) % words.length;
        return setTimeout(tick, 400);
      }
      setTimeout(tick, 45);
    };
    setTimeout(tick, INTRO + 150);
  };

  const initWelcome = () => {
    const box = document.getElementById("welcomeMsg");
    if (!box) return;
    const h = new Date().getHours();
    const greet = h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
    box.textContent = `${greet}!\nWelcome  to My portfolio.`;
    setTimeout(() => { box.classList.add("show"); }, 1200);
    setTimeout(() => { box.classList.remove("show"); }, 6000);
  };

  const navigate = (href) => {
    window.location.href = href;
  };

  const initPageTransitions = () => {
    return;
  };

  const initAlertButtons = () => {
    document.querySelectorAll(".js-alert").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        alert(btn.getAttribute("data-alert") || "Hello!");
        navigate(btn.getAttribute("href"));
      });
    });
  };

  const initScrollEffects = () => {
    const topBtn = document.getElementById("backToTop");
    const bar = document.getElementById("scrollProgress");
    const header = document.getElementById("siteHeader");
    const hero = document.getElementById("heroRight");
    let ticking = false;

    const update = () => {
      const y = window.scrollY || window.pageYOffset;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (bar) bar.style.width = `${max > 0 ? (y / max) * 100 : 0}%`;
      if (topBtn) topBtn.classList.toggle("show", y > 300);
      if (header) header.classList.toggle("scrolled", y > 10);
      if (PARALLAX && hero && !reduceMotion && y < window.innerHeight) {
        hero.style.setProperty("--py", `${y * 0.25}px`);
      }
      ticking = false;
    };

    window.addEventListener("scroll", () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }, { passive: true });

    window.addEventListener("resize", update);
    update();

    if (topBtn) {
      topBtn.addEventListener("click", () => {
        window.scrollTo({
          top: 0,
          behavior: (SMOOTH_SCROLL && !reduceMotion) ? "smooth" : "auto"
        });
      });
    }
  };

  const initClock = () => {
    const el = document.getElementById("liveClock");
    if (!el) return;
    const update = () => {
      const now = new Date();
      const date = now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
      const time = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      el.textContent = `${date} | ${time}`;
    };
    update();
    setInterval(update, 1000);
  };

  const initReadMore = () => {
    document.querySelectorAll(".toggle-btn").forEach((btn) => {
      const target = document.getElementById(btn.getAttribute("data-target"));
      if (!target) return;
      const hasArrow = !!btn.querySelector(".arrow");
      btn.addEventListener("click", () => {
        const open = target.hidden;
        target.hidden = !open;
        btn.setAttribute("aria-expanded", String(open));
        const text = open ? "Show less" : "Read more";
        btn.innerHTML = hasArrow ? `${text} <span class="arrow">&rarr;</span>` : text;
      });
    });
  };

  const initReveal = () => {
    document.querySelectorAll("[data-stagger]").forEach((group) => {
      const anim = group.getAttribute("data-anim");
      Array.from(group.children).forEach((child, i) => {
        child.classList.add("reveal");
        if (anim) child.setAttribute("data-anim", anim);
        child.style.setProperty("--d", `${i * 0.12}s`);
      });
    });

    const els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || reduceMotion) {
      els.forEach((el) => { el.classList.add("in"); });
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target;
        const delay = parseFloat(el.style.getPropertyValue("--d")) || 0;
        el.classList.add("in");
        io.unobserve(el);
        setTimeout(() => { el.classList.remove("reveal", "in"); }, (delay + 1.1) * 1000);
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });

    setTimeout(() => { els.forEach((el) => { io.observe(el); }); }, INTRO);
  };

  const initCounters = () => {
    const box = document.getElementById("stats");
    const nums = document.querySelectorAll(".stat-num");
    if (!box || !nums.length) return;

    const run = () => {
      nums.forEach((el) => {
        const target = parseInt(el.getAttribute("data-target"), 10) || 0;
        let n = 0;
        const step = Math.max(1, Math.ceil(target / 40));
        const timer = setInterval(() => {
          n = Math.min(target, n + step);
          el.textContent = n;
          if (n >= target) clearInterval(timer);
        }, 40);
      });
    };

    if (!("IntersectionObserver" in window)) {
      run();
      return;
    }

    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        io.disconnect();
        setTimeout(run, 1000 + INTRO);
      }
    }, { threshold: 0.4 });
    io.observe(box);
  };

  const initSkillBars = () => {
    const bars = document.querySelectorAll(".bar-fill");
    if (!bars.length) return;
    const fill = (b) => { b.style.width = `${b.getAttribute("data-level")}%`; };
    if (!("IntersectionObserver" in window)) {
      bars.forEach(fill);
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          fill(en.target);
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.4 });
    bars.forEach((b) => { io.observe(b); });
  };

  const initImages = () => {
    const svg = (kind, w, h) => {
      let inner;
      if (kind === "portrait") {
        inner = `<circle cx="${w / 2}" cy="${h * 0.34}" r="${w * 0.2}" fill="#0A0A0A"/>` +
                `<path d="M${w * 0.08} ${h} Q${w * 0.1} ${h * 0.62} ${w / 2} ${h * 0.6} Q${w * 0.9} ${h * 0.62} ${w * 0.92} ${h} Z" fill="#0A0A0A"/>`;
      } else {
        inner = `<rect width="${w}" height="${h}" fill="#1b1b1b"/>` +
                `<rect x="${w * 0.08}" y="${h * 0.15}" width="${w * 0.84}" height="${h * 0.12}" rx="8" fill="#80FF00"/>` +
                `<rect x="${w * 0.08}" y="${h * 0.38}" width="${w * 0.5}" height="${h * 0.38}" rx="8" fill="#333"/>` +
                `<rect x="${w * 0.62}" y="${h * 0.38}" width="${w * 0.3}" height="${h * 0.38}" rx="8" fill="#2a2a2a"/>`;
      }
      const s = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${inner}</svg>`;
      return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(s)}`;
    };

    document.querySelectorAll("img").forEach((img) => {
      const shown = () => { img.classList.add("loaded"); };
      const swap = () => {
        img.onerror = null;
        const kind = img.getAttribute("data-placeholder") || "project";
        const w = parseInt(img.getAttribute("width"), 10) || 480;
        const h = parseInt(img.getAttribute("height"), 10) || 300;
        img.src = svg(kind, w, h);
      };
      img.addEventListener("load", shown);
      if (img.hasAttribute("data-placeholder")) {
        img.onerror = swap;
        if (img.complete && img.naturalWidth === 0 && img.getAttribute("loading") !== "lazy") swap();
      }
      if (img.complete && img.naturalWidth > 0) shown();
    });
  };

  const initCardEffects = () => {
    if (reduceMotion || !canHover) return;
    document.querySelectorAll(".card").forEach((card) => {
      const tilt = card.classList.contains("project");
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        card.style.setProperty("--mx", `${px * 100}%`);
        card.style.setProperty("--my", `${py * 100}%`);
        if (tilt) {
          card.style.transform = `perspective(800px) rotateY(${(px - 0.5) * 8}deg) rotateX(${-(py - 0.5) * 8}deg) translateY(-8px)`;
        }
      });
      card.addEventListener("mouseleave", () => {
        if (tilt) card.style.transform = "";
      });
    });
  };

  const initMagnetic = () => {
    if (reduceMotion || !canHover) return;
    document.querySelectorAll(".btn").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - (r.left + r.width / 2)) / r.width;
        const y = (e.clientY - (r.top + r.height / 2)) / r.height;
        btn.style.setProperty("--tx", `${x * 10}px`);
        btn.style.setProperty("--ty", `${y * 8}px`);
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.setProperty("--tx", "0px");
        btn.style.setProperty("--ty", "0px");
      });
    });
  };

  const initRipple = () => {
    if (reduceMotion) return;
    document.querySelectorAll(".btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const r = btn.getBoundingClientRect();
        const size = Math.max(r.width, r.height);
        const dot = document.createElement("span");
        dot.className = "ripple";
        dot.style.width = dot.style.height = `${size}px`;
        dot.style.left = `${e.clientX - r.left - size / 2}px`;
        dot.style.top = `${e.clientY - r.top - size / 2}px`;
        btn.appendChild(dot);
        setTimeout(() => { dot.remove(); }, 650);
      });
    });
  };

  const initContactForm = () => {
    const form = document.getElementById("contactForm");
    if (!form) return;
    const status = document.getElementById("formStatus");

    const setError = (id, msg) => {
      const input = document.getElementById(id);
      const out = form.querySelector(`.error[data-for="${id}"]`);
      const field = input.parentElement;
      field.classList.remove("invalid");
      if (msg) {
        void field.offsetWidth;
        field.classList.add("invalid");
      }
      if (out) out.textContent = msg;
      return !msg;
    };

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const message = document.getElementById("message").value.trim();
      let ok = true;
      ok = setError("name", name.length < 2 ? "Please enter your name." : "") && ok;
      ok = setError("email", /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "" : "Please enter a valid email.") && ok;
      ok = setError("message", message.length < 10 ? "Message should be at least 10 characters." : "") && ok;

      if (!ok) {
        status.textContent = "";
        return;
      }
      status.textContent = `We realy appreciate Your Message, ${name}! This feature is still in maintenance, so please contact me in my email.`;
      alert(`thank you, ${name}! This feature is still in maintenance, so please contact me in my email instead.`);
      form.reset();
    });
  };
})();
