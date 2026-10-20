(() => {
  "use strict";

  const rootElement = document.documentElement;
  const prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const supportsHover = window.matchMedia && window.matchMedia("(hover: hover)").matches;

  const ENABLE_SMOOTH_SCROLL = false;
  const ENABLE_PARALLAX = false;
  const INTRO_DELAY_MS = 0;

  try {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      rootElement.setAttribute("data-theme", savedTheme);
    }
  } catch (error) {
  }

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

  window.addEventListener("pageshow", (event) => {
    const pageWipeOverlay = document.getElementById("pageWipe");
    if (pageWipeOverlay && event.persisted) {
      pageWipeOverlay.classList.remove("leaving");
    }
  });

  const initTheme = () => {
    const themeToggleButton = document.getElementById("themeToggle");
    if (!themeToggleButton) return;

    const renderThemeUI = () => {
      const isLightTheme = rootElement.getAttribute("data-theme") === "light";
      themeToggleButton.innerHTML = isLightTheme ? "&#9728;" : "&#9790;";
      themeToggleButton.setAttribute(
        "aria-label",
        isLightTheme ? "Switch to dark mode" : "Switch to light mode"
      );
    };

    renderThemeUI();

    themeToggleButton.addEventListener("click", () => {
      const nextTheme = rootElement.getAttribute("data-theme") === "light" ? "dark" : "light";
      rootElement.setAttribute("data-theme", nextTheme);
      try {
        localStorage.setItem("theme", nextTheme);
      } catch (error) { }
      renderThemeUI();
    });
  };

  const initMobileMenu = () => {
    const navToggleButton = document.getElementById("navToggle");
    const navLinksContainer = document.getElementById("navLinks");
    if (!navToggleButton || !navLinksContainer) return;

    navToggleButton.addEventListener("click", () => {
      const isOpen = navLinksContainer.classList.toggle("open");
      navToggleButton.setAttribute("aria-expanded", String(isOpen));
    });
  };

  const initSplitText = () => {
    if (prefersReducedMotion) return;

    document.querySelectorAll("[data-split]").forEach((element) => {
      const originalLabel = element.textContent.trim();
      let wordIndex = 0;

      const walkNodes = (parentNode) => {
        Array.from(parentNode.childNodes).forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            const fragment = document.createDocumentFragment();

            node.textContent.split(/(\s+)/).forEach((part) => {
              if (!part) return;

              if (/^\s+$/.test(part)) {
                fragment.appendChild(document.createTextNode(" "));
                return;
              }

              const wordWrapper = document.createElement("span");
              wordWrapper.className = "word";
              wordWrapper.setAttribute("aria-hidden", "true");

              const wordInner = document.createElement("span");
              wordInner.className = "word-in";
              wordInner.style.animationDelay = `${INTRO_DELAY_MS / 1000 + 0.1 + wordIndex * 0.08}s`;
              wordInner.textContent = part;

              wordWrapper.appendChild(wordInner);
              fragment.appendChild(wordWrapper);
              wordIndex++;
            });

            node.parentNode.replaceChild(fragment, node);
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            walkNodes(node);
          }
        });
      };

      walkNodes(element);
      element.setAttribute("aria-label", originalLabel);
    });
  };

  const initTypewriter = () => {
    const typedTextElement = document.getElementById("typedText");
    if (!typedTextElement) return;

    const phrases = ["BSIT Student", "Front-End Developer", "Future Full-Stack developer"];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const tick = () => {
      const currentPhrase = phrases[phraseIndex];

      if (!isDeleting) {
        charIndex++;
        typedTextElement.textContent = currentPhrase.slice(0, charIndex);

        if (charIndex === currentPhrase.length) {
          isDeleting = true;
          return setTimeout(tick, 1400);
        }
        return setTimeout(tick, 90);
      }

      charIndex--;
      typedTextElement.textContent = currentPhrase.slice(0, charIndex);

      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        return setTimeout(tick, 400);
      }

      setTimeout(tick, 45);
    };

    setTimeout(tick, INTRO_DELAY_MS + 150);
  };

  const initWelcome = () => {
    const welcomeBox = document.getElementById("welcomeMsg");
    if (!welcomeBox) return;

    const currentHour = new Date().getHours();
    const greeting = currentHour < 12 ? "Good morning" : currentHour < 18 ? "Good afternoon" : "Good evening";

    welcomeBox.textContent = `${greeting}!\nWelcome  to My portfolio.`;

    setTimeout(() => { welcomeBox.classList.add("show"); }, 1200);
    setTimeout(() => { welcomeBox.classList.remove("show"); }, 6000);
  };

  const navigateTo = (url) => {
    window.location.href = url;
  };

  const initPageTransitions = () => {
    return;
  };

  const initAlertButtons = () => {
    document.querySelectorAll(".js-alert").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        alert(button.getAttribute("data-alert") || "Hello!");
        navigateTo(button.getAttribute("href"));
      });
    });
  };

  const initScrollEffects = () => {
    const backToTopBtn = document.getElementById("backToTop");
    const progressBar = document.getElementById("scrollProgress");
    const siteHeader = document.getElementById("siteHeader");
    const heroRightSection = document.getElementById("heroRight");
    let isTicking = false;

    const updateScrollValues = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

      if (progressBar) {
        progressBar.style.width = `${maxScroll > 0 ? (scrollY / maxScroll) * 100 : 0}%`;
      }
      if (backToTopBtn) {
        backToTopBtn.classList.toggle("show", scrollY > 300);
      }
      if (siteHeader) {
        siteHeader.classList.toggle("scrolled", scrollY > 10);
      }
      if (ENABLE_PARALLAX && heroRightSection && !prefersReducedMotion && scrollY < window.innerHeight) {
        heroRightSection.style.setProperty("--py", `${scrollY * 0.25}px`);
      }

      isTicking = false;
    };

    window.addEventListener("scroll", () => {
      if (!isTicking) {
        isTicking = true;
        requestAnimationFrame(updateScrollValues);
      }
    }, { passive: true });

    window.addEventListener("resize", updateScrollValues);
    updateScrollValues();

    if (backToTopBtn) {
      backToTopBtn.addEventListener("click", () => {
        window.scrollTo({
          top: 0,
          behavior: (ENABLE_SMOOTH_SCROLL && !prefersReducedMotion) ? "smooth" : "auto"
        });
      });
    }
  };

  const initClock = () => {
    const clockElement = document.getElementById("liveClock");
    if (!clockElement) return;

    const updateClock = () => {
      const now = new Date();
      const dateString = now.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric"
      });
      const timeString = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      });

      clockElement.textContent = `${dateString} | ${timeString}`;
    };

    updateClock();
    setInterval(updateClock, 1000);
  };

  const initReadMore = () => {
    document.querySelectorAll(".toggle-btn").forEach((button) => {
      const targetElement = document.getElementById(button.getAttribute("data-target"));
      if (!targetElement) return;

      const hasArrowIcon = !!button.querySelector(".arrow");

      button.addEventListener("click", () => {
        const isCurrentlyHidden = targetElement.hidden;
        targetElement.hidden = !isCurrentlyHidden;

        button.setAttribute("aria-expanded", String(isCurrentlyHidden));

        const labelText = isCurrentlyHidden ? "Show less" : "Read more";
        button.innerHTML = hasArrowIcon ? `${labelText} <span class="arrow">&rarr;</span>` : labelText;
      });
    });
  };

  const initReveal = () => {
    document.querySelectorAll("[data-stagger]").forEach((group) => {
      const animationType = group.getAttribute("data-anim");

      Array.from(group.children).forEach((child, index) => {
        child.classList.add("reveal");
        if (animationType) {
          child.setAttribute("data-anim", animationType);
        }
        child.style.setProperty("--d", `${index * 0.12}s`);
      });
    });

    const revealElements = document.querySelectorAll(".reveal");

    if (!("IntersectionObserver" in window) || prefersReducedMotion) {
      revealElements.forEach((element) => { element.classList.add("in"); });
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const target = entry.target;
        const delayInSeconds = parseFloat(target.style.getPropertyValue("--d")) || 0;

        target.classList.add("in");
        observer.unobserve(target);

        setTimeout(() => {
          target.classList.remove("reveal", "in");
        }, (delayInSeconds + 1.1) * 1000);
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });

    setTimeout(() => {
      revealElements.forEach((element) => { observer.observe(element); });
    }, INTRO_DELAY_MS);
  };

  const initCounters = () => {
    const statsContainer = document.getElementById("stats");
    const statNumbers = document.querySelectorAll(".stat-num");
    if (!statsContainer || !statNumbers.length) return;

    const startCounters = () => {
      statNumbers.forEach((element) => {
        const targetValue = parseInt(element.getAttribute("data-target"), 10) || 0;
        let currentValue = 0;
        const stepValue = Math.max(1, Math.ceil(targetValue / 40));

        const counterTimer = setInterval(() => {
          currentValue = Math.min(targetValue, currentValue + stepValue);
          element.textContent = currentValue;

          if (currentValue >= targetValue) {
            clearInterval(counterTimer);
          }
        }, 40);
      });
    };

    if (!("IntersectionObserver" in window)) {
      startCounters();
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        observer.disconnect();
        setTimeout(startCounters, 1000 + INTRO_DELAY_MS);
      }
    }, { threshold: 0.4 });

    observer.observe(statsContainer);
  };

  const initSkillBars = () => {
    const skillBars = document.querySelectorAll(".bar-fill");
    if (!skillBars.length) return;

    const fillBar = (barElement) => {
      barElement.style.width = `${barElement.getAttribute("data-level")}%`;
    };

    if (!("IntersectionObserver" in window)) {
      skillBars.forEach(fillBar);
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          fillBar(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    skillBars.forEach((bar) => { observer.observe(bar); });
  };

  const initImages = () => {
    const createPlaceholderSvg = (kind, width, height) => {
      let svgInnerHtml;

      if (kind === "portrait") {
        svgInnerHtml =
          `<circle cx="${width / 2}" cy="${height * 0.34}" r="${width * 0.2}" fill="#0A0A0A"/>` +
          `<path d="M${width * 0.08} ${height} Q${width * 0.1} ${height * 0.62} ${width / 2} ${height * 0.6} Q${width * 0.9} ${height * 0.62} ${width * 0.92} ${height} Z" fill="#0A0A0A"/>`;
      } else {
        svgInnerHtml =
          `<rect width="${width}" height="${height}" fill="#1b1b1b"/>` +
          `<rect x="${width * 0.08}" y="${height * 0.15}" width="${width * 0.84}" height="${height * 0.12}" rx="8" fill="#80FF00"/>` +
          `<rect x="${width * 0.08}" y="${height * 0.38}" width="${width * 0.5}" height="${height * 0.38}" rx="8" fill="#333"/>` +
          `<rect x="${width * 0.62}" y="${height * 0.38}" width="${width * 0.3}" height="${height * 0.38}" rx="8" fill="#2a2a2a"/>`;
      }

      const fullSvgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${svgInnerHtml}</svg>`;
      return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(fullSvgString)}`;
    };

    document.querySelectorAll("img").forEach((imageElement) => {
      const handleImageLoaded = () => {
        imageElement.classList.add("loaded");
      };

      const handleImageError = () => {
        imageElement.onerror = null;
        const placeholderType = imageElement.getAttribute("data-placeholder") || "project";
        const width = parseInt(imageElement.getAttribute("width"), 10) || 480;
        const height = parseInt(imageElement.getAttribute("height"), 10) || 300;

        imageElement.src = createPlaceholderSvg(placeholderType, width, height);
      };

      imageElement.addEventListener("load", handleImageLoaded);

      if (imageElement.hasAttribute("data-placeholder")) {
        imageElement.onerror = handleImageError;
        if (
          imageElement.complete &&
          imageElement.naturalWidth === 0 &&
          imageElement.getAttribute("loading") !== "lazy"
        ) {
          handleImageError();
        }
      }

      if (imageElement.complete && imageElement.naturalWidth > 0) {
        handleImageLoaded();
      }
    });
  };

  const initCardEffects = () => {
    if (prefersReducedMotion || !supportsHover) return;

    document.querySelectorAll(".card").forEach((cardElement) => {
      const isProjectCard = cardElement.classList.contains("project");

      cardElement.addEventListener("mousemove", (event) => {
        const bounds = cardElement.getBoundingClientRect();
        const percentX = (event.clientX - bounds.left) / bounds.width;
        const percentY = (event.clientY - bounds.top) / bounds.height;

        cardElement.style.setProperty("--mx", `${percentX * 100}%`);
        cardElement.style.setProperty("--my", `${percentY * 100}%`);

        if (isProjectCard) {
          const rotateY = (percentX - 0.5) * 8;
          const rotateX = -(percentY - 0.5) * 8;
          cardElement.style.transform = `perspective(800px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) translateY(-8px)`;
        }
      });

      cardElement.addEventListener("mouseleave", () => {
        if (isProjectCard) {
          cardElement.style.transform = "";
        }
      });
    });
  };

  const initMagnetic = () => {
    if (prefersReducedMotion || !supportsHover) return;

    document.querySelectorAll(".btn").forEach((buttonElement) => {
      buttonElement.addEventListener("mousemove", (event) => {
        const bounds = buttonElement.getBoundingClientRect();
        const offsetX = (event.clientX - (bounds.left + bounds.width / 2)) / bounds.width;
        const offsetY = (event.clientY - (bounds.top + bounds.height / 2)) / bounds.height;

        buttonElement.style.setProperty("--tx", `${offsetX * 10}px`);
        buttonElement.style.setProperty("--ty", `${offsetY * 8}px`);
      });

      buttonElement.addEventListener("mouseleave", () => {
        buttonElement.style.setProperty("--tx", "0px");
        buttonElement.style.setProperty("--ty", "0px");
      });
    });
  };

  const initRipple = () => {
    if (prefersReducedMotion) return;

    document.querySelectorAll(".btn").forEach((buttonElement) => {
      buttonElement.addEventListener("click", (event) => {
        const bounds = buttonElement.getBoundingClientRect();
        const rippleSize = Math.max(bounds.width, bounds.height);

        const rippleElement = document.createElement("span");
        rippleElement.className = "ripple";
        rippleElement.style.width = rippleElement.style.height = `${rippleSize}px`;

        rippleElement.style.left = `${event.clientX - bounds.left - rippleSize / 2}px`;
        rippleElement.style.top = `${event.clientY - bounds.top - rippleSize / 2}px`;

        buttonElement.appendChild(rippleElement);
        setTimeout(() => { rippleElement.remove(); }, 650);
      });
    });
  };

  const initContactForm = () => {
    const contactForm = document.getElementById("contactForm");
    if (!contactForm) return;

    const statusMessageElement = document.getElementById("formStatus");

    const setFieldError = (fieldId, errorMessage) => {
      const inputElement = document.getElementById(fieldId);
      const errorOutputElement = contactForm.querySelector(`.error[data-for="${fieldId}"]`);
      const fieldContainer = inputElement.parentElement;

      fieldContainer.classList.remove("invalid");

      if (errorMessage) {
        void fieldContainer.offsetWidth;
        fieldContainer.classList.add("invalid");
      }

      if (errorOutputElement) {
        errorOutputElement.textContent = errorMessage;
      }

      return !errorMessage;
    };

    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const nameValue = document.getElementById("name").value.trim();
      const emailValue = document.getElementById("email").value.trim();
      const messageValue = document.getElementById("message").value.trim();

      let isValid = true;
      const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);

      isValid = setFieldError("name", nameValue.length < 2 ? "Please enter your name." : "") && isValid;
      isValid = setFieldError("email", isEmailValid ? "" : "Please enter a valid email.") && isValid;
      isValid = setFieldError("message", messageValue.length < 10 ? "Message should be at least 10 characters." : "") && isValid;

      if (!isValid) {
        statusMessageElement.textContent = "";
        return;
      }

      statusMessageElement.textContent = `We really appreciate Your Message, ${nameValue}! This feature is still in maintenance, so please contact me via my email.`;
      alert(`Thank you, ${nameValue}! This feature is still in maintenance, so please contact me via my email instead.`);

      contactForm.reset();
    });
  };
})();
