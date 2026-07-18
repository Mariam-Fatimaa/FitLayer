(() => {
  const nav = document.getElementById('mainNav');
  const navToggle = document.getElementById('navToggle');
  const navMobile = document.getElementById('navMobile');
  const dropdowns = [...document.querySelectorAll('.nav-dropdown')];

  const updateNav = () => {
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 40);
    const hero = document.querySelector('.subhero, .hero-scroll');
    if (hero) {
      const rect = hero.getBoundingClientRect();
      nav.classList.toggle('over-dark-hero', rect.bottom > 72 && document.body.classList.contains('has-dark-hero'));
      nav.classList.toggle('light-nav', rect.bottom <= 72 && document.body.classList.contains('has-dark-hero'));
    }
  };
  updateNav();
  window.addEventListener('scroll', updateNav, { passive: true });

  navToggle?.addEventListener('click', () => {
    const open = navMobile?.classList.toggle('open');
    navToggle.classList.toggle('open', Boolean(open));
    navToggle.setAttribute('aria-expanded', String(Boolean(open)));
  });

  document.addEventListener('click', event => {
    const clickedDropdown = event.target.closest('.nav-dropdown');
    dropdowns.forEach(dropdown => { if (dropdown !== clickedDropdown) dropdown.removeAttribute('open'); });
    if (event.target.closest('a') && navMobile) {
      navMobile.classList.remove('open');
      navToggle?.classList.remove('open');
      navToggle?.setAttribute('aria-expanded', 'false');
    }
  });
})();
