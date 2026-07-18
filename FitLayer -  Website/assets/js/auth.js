(() => {
  const toast=document.createElement('div'); toast.className='toast'; document.body.appendChild(toast);
  const notify=message=>{ toast.textContent=message; toast.classList.add('show'); clearTimeout(notify.timer); notify.timer=setTimeout(()=>toast.classList.remove('show'),2200); };
  ['loginForm','registerForm'].forEach(id => document.getElementById(id)?.addEventListener('submit', event => {
    event.preventDefault(); notify(id === 'loginForm' ? 'Login form submitted.' : 'Account form submitted.');
  }));
})();
