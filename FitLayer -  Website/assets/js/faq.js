document.querySelectorAll('.faq-q').forEach(button => {
  button.addEventListener('click', () => button.closest('.faq-item')?.classList.toggle('open'));
});
