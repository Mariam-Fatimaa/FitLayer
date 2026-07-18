document.getElementById('billingToggle')?.addEventListener('click', event => {
  const button = event.target.closest('[data-billing]');
  if (!button) return;
  document.querySelectorAll('#billingToggle button').forEach(item => item.classList.toggle('active', item === button));
  document.querySelectorAll('.price-amount[data-monthly]').forEach(price => {
    const value = price.dataset[button.dataset.billing];
    price.innerHTML = `${value}<span>/mo</span>`;
  });
});
