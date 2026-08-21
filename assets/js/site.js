(() => {
  const root = document.documentElement;
  const header = document.querySelector('[data-site-header]');
  const toggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-site-nav]');

  root.classList.add('js');

  if (!header || !toggle || !nav) {
    return;
  }

  const toggleLabel = toggle.querySelector('.site-nav__toggle-label');
  const desktop = window.matchMedia('(min-width: 68.751rem)');

  const setOpen = (open, { returnFocus = false } = {}) => {
    toggle.setAttribute('aria-expanded', String(open));
    nav.hidden = !open;
    header.classList.toggle('site-header--menu-open', open);

    if (toggleLabel) {
      toggleLabel.textContent = open ? 'Close' : 'Menu';
    }
    toggle.setAttribute('aria-label', open ? 'Close main menu' : 'Open main menu');

    if (returnFocus) {
      toggle.focus();
    }
  };

  const syncNavigation = () => {
    if (desktop.matches) {
      toggle.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
      nav.hidden = false;
      header.classList.remove('site-header--menu-open');
      if (toggleLabel) {
        toggleLabel.textContent = 'Menu';
      }
      toggle.setAttribute('aria-label', 'Open main menu');
      return;
    }

    toggle.hidden = false;
    setOpen(false);
  };

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    setOpen(!isOpen);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || toggle.getAttribute('aria-expanded') !== 'true') {
      return;
    }

    setOpen(false, { returnFocus: true });
  });

  document.addEventListener('click', (event) => {
    if (
      toggle.getAttribute('aria-expanded') === 'true'
      && !nav.contains(event.target)
      && !toggle.contains(event.target)
    ) {
      setOpen(false);
    }
  });

  nav.addEventListener('click', (event) => {
    if (!desktop.matches && event.target.closest('a')) {
      setOpen(false);
    }
  });

  if (typeof desktop.addEventListener === 'function') {
    desktop.addEventListener('change', syncNavigation);
  } else {
    desktop.addListener(syncNavigation);
  }

  syncNavigation();
})();
