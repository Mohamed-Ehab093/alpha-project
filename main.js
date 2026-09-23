(() => {
  'use strict';

  const root = document.documentElement;
  const body = document.body;
  const langButtons = [...document.querySelectorAll('[data-language-toggle]')];
  const menuBtn = document.querySelector('#menu-btn');
  const nav = document.querySelector('#nav');
  const header = document.querySelector('#header');

  const currentLang = () => body.classList.contains('is-english') ? 'en' : 'ar';

  function getSavedLang() {
    try { return localStorage.getItem('language'); }
    catch { return null; }
  }

  function saveLang(lang) {
    try { localStorage.setItem('language', lang); }
    catch {}
  }

  function updateFormText(lang) {
    document.querySelectorAll('[data-placeholder-ar][data-placeholder-en]').forEach(field => {
      field.placeholder = field.dataset[lang === 'en' ? 'placeholderEn' : 'placeholderAr'];
    });

    document.querySelectorAll('option[data-label-ar][data-label-en]').forEach(option => {
      option.textContent = option.dataset[lang === 'en' ? 'labelEn' : 'labelAr'];
    });
  }

  function updateMenuLabel(open = false) {
    if (!menuBtn) return;
    const lang = currentLang() === 'en' ? 'En' : 'Ar';
    menuBtn.setAttribute('aria-label', menuBtn.dataset[`label${open ? 'Close' : 'Open'}${lang}`]);
  }

  function setLanguage(lang, save = true) {
    const english = lang === 'en';
    body.classList.toggle('is-english', english);
    root.lang = english ? 'en' : 'ar';
    root.dir = english ? 'ltr' : 'rtl';

    langButtons.forEach(button => {
      const text = button.querySelector('.lang-text');
      if (text) text.textContent = english ? 'العربية' : 'English';
      button.setAttribute('aria-label', english ? button.dataset.ariaLabelEn : button.dataset.ariaLabelAr);
    });

    updateFormText(lang);
    updateMenuLabel(false);
    if (save) saveLang(lang);
  }

  function closeMenu(focusButton = false) {
    if (!menuBtn || !nav) return;
    menuBtn.classList.remove('is-open');
    nav.classList.remove('is-open');
    menuBtn.setAttribute('aria-expanded', 'false');
    body.classList.remove('menu-open');
    updateMenuLabel(false);
    if (focusButton) menuBtn.focus();
  }

  function setActiveLink() {
    const file = location.pathname.split('/').pop() || 'index.html';
    const parents = {
      'branches.html': 'about.html',
      'breakdowns.html': 'maintenance.html',
      'cabins.html': 'factory.html',
      'parts.html': 'factory.html'
    };
    const active = parents[file] || file;

    document.querySelectorAll('.nav .nav-link').forEach(link => {
      const href = (link.getAttribute('href') || '').split('#')[0] || 'index.html';
      const match = href === active;
      link.classList.toggle('active', match);
      match ? link.setAttribute('aria-current', 'page') : link.removeAttribute('aria-current');
    });
  }

  function setupMenu() {
    if (!menuBtn || !nav) return;

    menuBtn.addEventListener('click', () => {
      const open = menuBtn.getAttribute('aria-expanded') !== 'true';
      menuBtn.classList.toggle('is-open', open);
      nav.classList.toggle('is-open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
      body.classList.toggle('menu-open', open);
      updateMenuLabel(open);
    });

    nav.addEventListener('click', e => {
      if (e.target.closest('.nav-link')) closeMenu();
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') closeMenu(true);
    });

    document.addEventListener('click', e => {
      if (menuBtn.getAttribute('aria-expanded') === 'true' && !nav.contains(e.target) && !menuBtn.contains(e.target)) closeMenu();
    });

    window.addEventListener('resize', () => {
      if (innerWidth > 900) closeMenu();
    });
  }

  function setupHeader() {
    if (!header) return;
    const update = () => header.classList.toggle('is-scrolled', scrollY > 50);
    update();
    addEventListener('scroll', update, { passive: true });
  }

  function setupReveal() {
    const items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      items.forEach(item => item.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      });
    }, { threshold: .12, rootMargin: '0px 0px -40px' });

    items.forEach(item => observer.observe(item));
  }

  function setupFaq() {
    document.querySelectorAll('.faq-question').forEach(button => {
      button.addEventListener('click', () => {
        const answer = document.getElementById(button.getAttribute('aria-controls'));
        if (!answer) return;
        const open = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', String(!open));
        answer.hidden = open;
      });
    });
  }

  function setupFilters() {
    const buttons = [...document.querySelectorAll('[data-project-filter]')];
    const cards = [...document.querySelectorAll('[data-project-category]')];
    if (!buttons.length || !cards.length) return;

    buttons.forEach(button => {
      button.addEventListener('click', () => {
        const filter = button.dataset.projectFilter;
        buttons.forEach(item => item.classList.toggle('active', item === button));
        cards.forEach(card => {
          const show = filter === 'all' || card.dataset.projectCategory === filter;
          card.classList.toggle('is-hidden', !show);
          card.setAttribute('aria-hidden', String(!show));
        });
      });
    });
  }

  function setupForms() {
    document.querySelectorAll('[data-demo-form]').forEach(form => {
      const status = form.querySelector('.form-status');

      form.addEventListener('submit', e => {
        e.preventDefault();
        if (!form.reportValidity()) {
          if (status) status.textContent = '';
          return;
        }
        if (!status) return;
        status.textContent = currentLang() === 'en' ? form.dataset.successEn : form.dataset.successAr;
        status.classList.add('is-success');
      });

      form.addEventListener('input', () => {
        if (!status) return;
        status.textContent = '';
        status.classList.remove('is-success');
      });
    });
  }

  function setupPlaceholderLinks() {
    document.querySelectorAll('[data-placeholder-link]').forEach(link => {
      link.addEventListener('click', e => e.preventDefault());
    });
  }

  function setupWhatsapp() {
    const button = document.querySelector('.whatsapp');
    const forms = [...document.querySelectorAll('[data-demo-form]')];
    if (!button || !forms.length || !('IntersectionObserver' in window)) return;

    const visible = new Set();
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.isIntersecting ? visible.add(entry.target) : visible.delete(entry.target));
      body.classList.toggle('form-in-view', visible.size > 0);
    });
    forms.forEach(form => observer.observe(form));
  }

  setLanguage(getSavedLang() === 'en' ? 'en' : 'ar', false);
  langButtons.forEach(button => button.addEventListener('click', () => setLanguage(currentLang() === 'ar' ? 'en' : 'ar')));
  setActiveLink();
  setupMenu();
  setupHeader();
  setupReveal();
  setupFaq();
  setupFilters();
  setupForms();
  setupPlaceholderLinks();
  setupWhatsapp();
})();
