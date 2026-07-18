(() => {
  const body = document.getElementById('demoBody');
  const resultGarment = document.getElementById('demoResultGarment');
  const colorName = document.getElementById('demoColorName');
  const panel = document.getElementById('demoWidgetPanel');
  const steps = [...document.querySelectorAll('.demo-widget-step')];
  const progress = [...document.querySelectorAll('.demo-progress span')];
  let selectedColor = '#A2674C';
  const setStep = (name, index) => {
    steps.forEach(step => step.classList.toggle('active', step.dataset.demoStep === name));
    progress.forEach((bar, i) => bar.classList.toggle('active', i <= index));
  };
  document.querySelectorAll('.swatch').forEach(swatch => swatch.addEventListener('click', () => {
    document.querySelectorAll('.swatch').forEach(item => item.classList.remove('active'));
    swatch.classList.add('active'); selectedColor = swatch.dataset.demoColor;
    body?.style.setProperty('--demo-garment', selectedColor); resultGarment?.style.setProperty('--demo-garment', selectedColor);
    if (colorName) colorName.textContent = swatch.dataset.colorName || 'Selected color';
  }));
  document.querySelectorAll('.demo-sizes button').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('.demo-sizes button').forEach(item => item.classList.remove('active')); button.classList.add('active');
  }));
  document.getElementById('demoTryButton')?.addEventListener('click', () => { setStep('upload',0); panel?.scrollIntoView({behavior:'smooth',block:'center'}); });
  document.getElementById('demoUpload')?.addEventListener('click', () => {
    setStep('processing',1); const text=document.getElementById('demoProcessingText'); const states=['Analyzing pose','Matching garment','Refining fabric']; let i=0;
    if(text) text.textContent=states[0]; const interval=setInterval(()=>{ i++; if(i<states.length&&text) text.textContent=states[i]; },650);
    setTimeout(()=>{ clearInterval(interval); resultGarment?.style.setProperty('--demo-garment',selectedColor); setStep('result',2); },2100);
  });
  document.getElementById('demoRestart')?.addEventListener('click',()=>setStep('upload',0));
  document.getElementById('demoWidgetClose')?.addEventListener('click',()=>setStep('upload',0));
})();
