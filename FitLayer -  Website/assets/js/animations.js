(() => {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('in'); });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  document.querySelectorAll('.metric-cell strong').forEach(el => {
    const metricObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting || entry.target.dataset.animated) return;
      entry.target.dataset.animated = 'true';
      entry.target.animate([{opacity:.2,transform:'translateY(6px)'},{opacity:1,transform:'none'}], {duration:500,easing:'ease-out'});
    }), {threshold:.4});
    metricObserver.observe(el);
  });
})();
