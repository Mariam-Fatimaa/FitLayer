    (() => {
      gsap.registerPlugin(ScrollTrigger);
      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
      const canvas = document.getElementById('studioCanvas');
      const scanline = document.getElementById('scanline');
      const statusPill = document.getElementById('statusPill');
      const statusText = document.getElementById('statusText');
      const outfitIndex = document.getElementById('outfitIndex');
      const outfitName = document.getElementById('outfitName');
      const progress = document.getElementById('progress');

      const names = ['Plain White T-Shirt', 'Casual Hoodie', 'Bomber Jacket', 'Denim Jacket', 'Smart Overshirt', 'Tailored Blazer', 'Final Premium Outfit'];
      names.forEach((_, i) => { const bar = document.createElement('i'); if (i === 0) bar.classList.add('active'); progress.appendChild(bar); });

      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.outputEncoding = THREE.sRGBEncoding;

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xd9d3ca);
      scene.fog = new THREE.Fog(0xd9d3ca, 7, 18);

      const camera = new THREE.PerspectiveCamera(35, innerWidth / innerHeight, .1, 40);
      camera.position.set(-1.9, 2.15, 8.9);
      const target = new THREE.Vector3(.85, 1.4, 0);

      scene.add(new THREE.HemisphereLight(0xfffdf8, 0x8c8276, 1.05));
      const key = new THREE.DirectionalLight(0xfff4e5, 2.15); key.position.set(4, 7, 4); key.castShadow = true; key.shadow.mapSize.set(1024, 1024); scene.add(key);
      const fill = new THREE.DirectionalLight(0xdce6ff, .62); fill.position.set(-4, 3, 2); scene.add(fill);
      const rim = new THREE.DirectionalLight(0xffffff, .45); rim.position.set(-1, 4, -4); scene.add(rim);

      const mat = (c, r = .75, m = .02) => new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: m });
      const studio = new THREE.Group(); scene.add(studio);
      const floor = new THREE.Mesh(new THREE.PlaneGeometry(24, 22), mat(0xcac3b8, .48, .04)); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; studio.add(floor);
      const cyc = new THREE.Mesh(new THREE.CylinderGeometry(8, 8, 8.5, 72, 1, true, Math.PI * .12, Math.PI * .76), mat(0xe6e0d7, .88)); cyc.position.set(0, 4.2, -1.7); cyc.rotation.y = Math.PI; studio.add(cyc);
      const platform = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.72, .2, 64), mat(0xbcb4a8, .45, .04)); platform.position.set(.85, .1, 0); platform.receiveShadow = true; studio.add(platform);

      function box(x, y, z, w, h, d, c, r = .72) { const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(c, r)); mesh.position.set(x, y, z); mesh.castShadow = mesh.receiveShadow = true; studio.add(mesh); return mesh }
      const archL = box(-3.8, 2.5, -.35, .62, 5.1, 1.7, 0xc7bfb4);
      const archR = box(4.7, 2.3, -1, .48, 4.6, 1.2, 0xcfc7bb);
      box(-2.6, 3.1, -3.35, 1.6, 3.9, .34, 0xd6cfc5);
      box(3.1, 3, -3.45, 1.55, 3.7, .3, 0xd4cdc3);
      const panels = [];
      [[-3.05, 3.45, -1.15], [3.45, 3.2, -1.45]].forEach(p => { const m = new THREE.Mesh(new THREE.BoxGeometry(1.05, 3.25, .07), new THREE.MeshBasicMaterial({ color: 0xfffbf2 })); m.position.set(...p); studio.add(m); panels.push(m) });
      for (let i = -2; i <= 2; i++) { const strip = new THREE.Mesh(new THREE.BoxGeometry(1.55, .035, .08), new THREE.MeshBasicMaterial({ color: 0xfff7e8 })); strip.position.set(i * 1.72, 5.65, -2.1); studio.add(strip) }

      const model = new THREE.Group(); model.position.set(2.7, 0, 0); model.scale.setScalar(.98); studio.add(model);
      const skin = mat(0xc58e71, .72), trousers = mat(0x242526, .82), white = mat(0xf2f0eb, .9);
      const head = new THREE.Mesh(new THREE.SphereGeometry(.19, 32, 32), skin); head.position.y = 2.1; head.castShadow = true; model.add(head);
      const neck = new THREE.Mesh(new THREE.CylinderGeometry(.075, .085, .16, 18), skin); neck.position.y = 1.91; model.add(neck);
      const torsoMat = white; const torso = new THREE.Mesh(new THREE.CylinderGeometry(.35, .29, .84, 28), torsoMat); torso.position.y = 1.48; torso.castShadow = true; model.add(torso);
      const hips = new THREE.Mesh(new THREE.CylinderGeometry(.29, .24, .3, 24), trousers); hips.position.y = .95; model.add(hips);
      [-.14, .14].forEach(x => { const leg = new THREE.Mesh(new THREE.CylinderGeometry(.096, .075, .92, 20), trousers); leg.position.set(x, .45, 0); leg.castShadow = true; model.add(leg); const shoe = new THREE.Mesh(new THREE.BoxGeometry(.18, .1, .39), white); shoe.position.set(x, .04, .08); shoe.castShadow = true; model.add(shoe) });
      function arm(side) { const g = new THREE.Group(); g.position.set(side * .43, 1.76, 0); g.rotation.z = side * -.09; const sleeve = new THREE.Mesh(new THREE.CylinderGeometry(.086, .071, .49, 18), torsoMat); sleeve.position.y = -.24; sleeve.castShadow = true; g.add(sleeve); const fore = new THREE.Mesh(new THREE.CylinderGeometry(.065, .055, .44, 18), skin); fore.position.y = -.69; fore.castShadow = true; g.add(fore); model.add(g); return g }
      const armL = arm(-1), armR = arm(1);
      const hood = new THREE.Mesh(new THREE.TorusGeometry(.23, .07, 14, 28), mat(0xaaa59d)); hood.position.set(0, 1.87, -.08); hood.rotation.x = Math.PI / 2; hood.visible = false; model.add(hood);
      const coat = new THREE.Mesh(new THREE.CylinderGeometry(.43, .36, 1.1, 28, 1, true), mat(0x675248, .72)); coat.position.y = 1.35; coat.visible = false; coat.castShadow = true; model.add(coat);
      const lapels = [];[-1, 1].forEach(s => { const l = new THREE.Mesh(new THREE.BoxGeometry(.075, .42, .035), mat(0x2b2d31)); l.position.set(s * .13, 1.56, .3); l.rotation.z = s * -.34; l.visible = false; model.add(l); lapels.push(l) });
      const colors = [0xf2f0eb, 0xa9a49b, 0x364035, 0x486b8e, 0x8a785e, 0x2c2d31, 0x151617];
      let current = 0;
      function applyLook(i) {
        current = i; torso.visible = i !== 6; coat.visible = i === 6; hood.visible = i === 1; lapels.forEach(l => l.visible = i === 5);
        torsoMat.color.setHex(colors[i]); armL.children[0].material.color.setHex(colors[i]); armR.children[0].material.color.setHex(colors[i]);
        outfitIndex.textContent = String(i + 1).padStart(2, '0') + ' / 07'; outfitName.textContent = names[i];
        [...progress.children].forEach((bar, n) => bar.classList.toggle('active', n === i));
      }
      applyLook(0);

      const shadow = new THREE.Mesh(new THREE.CircleGeometry(.82, 48), new THREE.MeshBasicMaterial({ color: 0x574e45, transparent: true, opacity: .16, depthWrite: false })); shadow.rotation.x = -Math.PI / 2; shadow.position.y = .012; model.add(shadow);

      let mouseX = 0, mouseY = 0;
      addEventListener('pointermove', e => { mouseX = (e.clientX / innerWidth - .5) * 2; mouseY = (e.clientY / innerHeight - .5) * 2 });
      function resize() { renderer.setSize(innerWidth, innerHeight, false); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix() } resize(); addEventListener('resize', resize);

      const state = { scan: 0, look: 0 };
      const statuses = ['Analyzing Body', 'Detecting Proportions', 'Matching Garment', 'Generating Preview', 'Preview Ready'];
      function updateScan(t) { scanline.style.opacity = Math.sin(Math.PI * t); scanline.style.top = (18 + t * 64) + '%'; statusPill.style.opacity = Math.min(1, Math.sin(Math.PI * t) * 1.35); statusText.textContent = statuses[Math.min(statuses.length - 1, Math.floor(t * statuses.length))] }

      const tl = gsap.timeline({
        defaults: { ease: 'none' }, scrollTrigger: {
          trigger: '#heroScroll', start: 'top top', end: 'bottom bottom', scrub: reduce ? true : .8, anticipatePin: 1, invalidateOnRefresh: true, onUpdate: self => {
            const p = self.progress;
            if (p > .24 && p < .84) {
              const local = (p - .24) / .60;
              const scaled = local * 7;
              const idx = Math.min(6, Math.floor(scaled));
              const frac = scaled - idx;
              updateScan(frac);
              if (idx !== current) applyLook(idx);
            } else { scanline.style.opacity = 0; statusPill.style.opacity = 0 }
          }
        }
      });

      tl.addLabel('intro', 0)
        .to(model.position, { x: 1.45, duration: .13, ease: 'power2.out' }, .06)
        .to(camera.position, { x: -1.35, y: 2.05, z: 8.15, duration: .13 }, .06)
        .addLabel('walkForward', .14)
        .to(model.position, { x: .85, duration: .12, ease: 'power2.out' }, .14)
        .to(camera.position, { x: -.75, y: 1.95, z: 7.2, duration: .12 }, .14)
        .to(archL.position, { x: -4.15, duration: .18 }, .12)
        .to(archR.position, { x: 4.9, duration: .18 }, .12)
        .addLabel('analyze', .24)
        .to(camera.position, { x: -.3, y: 1.86, z: 6.55, duration: .17 }, .24)
        .to(panels[0].position, { x: -2.9, duration: .28 }, .24)
        .to(panels[1].position, { x: 3.3, duration: .28 }, .24)
        .addLabel('hoodie', .32).addLabel('bomber', .40).addLabel('denim', .48).addLabel('overshirt', .56).addLabel('blazer', .64).addLabel('finalLook', .76)
        .to(camera.position, { x: .08, y: 1.9, z: 6.25, duration: .30 }, .48)
        .to(camera.position, { x: -.22, y: 1.96, z: 6.6, duration: .18 }, .76)
        .addLabel('finalHold', .84)
        .to(camera.position, { x: -.48, y: 2.02, z: 7.05, duration: .13 }, .84)
        .to('.hero-copy', { opacity: .38, duration: .1 }, .88)
        .to('.outfit-panel', { y: -18, duration: .1 }, .88)
        .addLabel('release', 1);

      const clock = new THREE.Clock();
      function render() {
        requestAnimationFrame(render);
        const t = clock.getElapsedTime();
        if (!reduce) {
          model.position.y = Math.sin(t * .85) * .008;
          model.rotation.y = Math.sin(t * .3) * .018;
          model.scale.y = .98 + Math.sin(t * .9) * .0025;
          armL.rotation.x = Math.sin(t * .72) * .013;
          armR.rotation.x = -Math.sin(t * .72 + .35) * .013;
          camera.position.x += ((camera.position.x + mouseX * .08) - camera.position.x) * .03;
          target.x = .85 + mouseX * .035; target.y = 1.4 - mouseY * .025;
        }
        camera.lookAt(target);
        renderer.render(scene, camera);
      }
      render();
    })();
  