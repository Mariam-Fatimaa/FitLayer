(() => {
  const tabs = document.querySelectorAll('.ctab');
  const panes = document.querySelectorAll('.code-pane');
  tabs.forEach(button => button.addEventListener('click', () => {
    tabs.forEach(tab => tab.classList.remove('active'));
    button.classList.add('active');
    panes.forEach(pane => pane.classList.toggle('active', pane.dataset.pane === button.dataset.tab));
  }));
  document.addEventListener('click', async event => {
    const button = event.target.closest('.copy-code');
    if (!button) return;
    try {
      await navigator.clipboard.writeText(button.dataset.copy || '');
      const old = button.textContent;
      button.textContent = 'Copied';
      setTimeout(() => button.textContent = old, 1200);
    } catch { button.textContent = 'Copy unavailable'; }
  });
  const search = document.getElementById('docsSearch');
  search?.addEventListener('input', () => {
    const query = search.value.trim().toLowerCase();
    document.querySelectorAll('#docsContent [data-doc]').forEach(block => {
      block.style.display = !query || (block.dataset.doc || '').includes(query) || block.textContent.toLowerCase().includes(query) ? '' : 'none';
    });
  });
})();
