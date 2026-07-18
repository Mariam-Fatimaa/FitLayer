(() => {
  const toast = document.createElement('div'); toast.className='toast'; document.body.appendChild(toast);
  const notify = message => { toast.textContent=message; toast.classList.add('show'); clearTimeout(notify.timer); notify.timer=setTimeout(()=>toast.classList.remove('show'),2200); };
  const form=document.getElementById('contactForm');
  form?.addEventListener('submit', event => { event.preventDefault(); notify('Message prepared successfully.'); });
})();
