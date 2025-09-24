document.addEventListener('DOMContentLoaded', () => {
  // IntersectionObserver pentru animații de tip "reveal"
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));

  // Popularea cronologiei
  const rssmTimeline = document.getElementById('rssm-timeline');
  if (rssmTimeline) {
    const rssmEvents = [
      { year: 1940, description: 'Anexarea Basarabiei și a nordului Bucovinei de către URSS.' },
      { year: 1941, description: 'Primul val de deportări spre Siberia și Kazahstan.' },
      { year: 1944, description: 'Reluarea administrației sovietice și intensificarea represiunilor.' },
      { year: 1946, description: 'Colectivizare forțată; penurie alimentară accentuată.' },
      { year: 1947, description: 'Foamete severă; mortalitate ridicată în satele RSSM.' },
      { year: 1949, description: 'Operațiunea „Юг” (Sud) — deportare masivă a țăranilor.' },
      { year: 1951, description: 'Deportarea grupurilor religioase și a „elementelor nesigure”.' },
      { year: 1953, description: 'Moartea lui Stalin; începutul dezghețului politic.' },
      { year: 1989, description: 'Recunoașterea crimelor regimului; reabilitări simbolice.' },
      { year: 1991, description: 'Independența Republicii Moldova; deschiderea arhivelor.' },
    ];

    rssmTimeline.innerHTML = '';
    rssmEvents.forEach(event => {
      const div = document.createElement('div');
      div.className = 'timeline-item reveal';
      div.innerHTML = `<strong>${event.year}</strong>: ${event.description}`;
      rssmTimeline.appendChild(div);
    });

    // Observe timeline items as well
    document.querySelectorAll('#rssm-timeline .reveal').forEach(el => io.observe(el));
  }

  // Evidențiere link activ din meniu la scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');
  const setActive = (id) => {
    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
  };
  const secObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
  sections.forEach(s => secObserver.observe(s));

  // Galerie: încarcă imagini locale din manifest.json, cu fallback, și render figure/figcaption + lightbox
  const galleryGrid = document.querySelector('.gallery-grid');
  if (galleryGrid) {
    const fallback = [
      { src: 'assets/images/Foametea.png', alt: 'Foametea 1946–1947', title: 'Foametea 1946–1947', caption: 'Criză alimentară severă și pierderi de vieți omenești în mediul rural.', category: 'Foametea' },
      { src: 'assets/images/Represiuni.png', alt: 'Arestări și Exiluri', title: 'Arestări și Exiluri', caption: 'Arestări, epurări și restrângerea libertăților în RSSM (1940–1953).', category: 'Represiuni' },
      { src: 'assets/images/Vagoane.jpg', alt: 'Vagoane folosite la deportări', title: 'Deportări în masă', caption: 'Transportul forțat al familiilor în Siberia și Kazahstan.', category: 'Deportări' },
      { src: 'assets/images/Afis Propagandistic.png', alt: 'Afiș propagandistic sovietic', title: 'Afiș propagandistic', caption: 'Exemplu de propagandă sovietică.', category: 'Altele' },
      { src: 'assets/images/Copii.png', alt: 'Copii înfometați', title: 'Copii înfometați', caption: 'Imagine simbolică a lipsurilor din anii 1940.', category: 'Altele' },
      { src: 'assets/images/Nou.jpg', alt: 'Nouă imagine', title: 'Nouă imagine', caption: 'Imagine nouă adăugată în galerie.', category: 'Altele' }
    ];

    // Creează lightbox (o singură dată)
    let lightbox = document.querySelector('.lightbox');
    if (!lightbox) {
      lightbox = document.createElement('div');
      lightbox.className = 'lightbox hidden';
      lightbox.innerHTML = `
        <div class="lightbox-backdrop"></div>
        <figure class="lightbox-content">
          <button class="lightbox-close" aria-label="Închide">×</button>
          <img alt="" />
          <figcaption><strong></strong><span></span></figcaption>
        </figure>
      `;
      document.body.appendChild(lightbox);
    }

    const openLightbox = (src, alt, title, caption) => {
      const img = lightbox.querySelector('img');
      const titleEl = lightbox.querySelector('figcaption strong');
      const capEl = lightbox.querySelector('figcaption span');
      img.src = src;
      img.alt = alt || '';
      titleEl.textContent = title || '';
      capEl.textContent = caption || '';
      lightbox.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    };
    const closeLightbox = () => {
      lightbox.classList.add('hidden');
      document.body.style.overflow = '';
    };
    lightbox.addEventListener('click', (e) => {
      if (e.target.classList.contains('lightbox-backdrop') || e.target.classList.contains('lightbox-close')) closeLightbox();
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

    const isInViewport = (el) => {
      const r = el.getBoundingClientRect();
      return r.top < window.innerHeight && r.bottom > 0;
    };

    const addImages = (items) => {
      items.forEach(({ src, alt, title, caption, category }) => {
        const figure = document.createElement('figure');
        figure.className = 'gallery-item reveal';
        if (category) figure.dataset.category = category;
        const img = document.createElement('img');
        img.loading = 'lazy';
        img.src = src;
        img.alt = alt || '';
        img.onerror = () => { figure.classList.add('hidden'); };
        const figc = document.createElement('figcaption');
        const strong = document.createElement('strong');
        strong.textContent = title || '';
        const span = document.createElement('span');
        span.textContent = caption || '';
        figc.appendChild(strong);
        figc.appendChild(span);
        figure.appendChild(img);
        figure.appendChild(figc);
        figure.addEventListener('click', () => openLightbox(src, alt, title, caption));
        galleryGrid.prepend(figure); // localele apar primele
        // Asigură vizibilitatea dacă IO nu notifică imediat
        if (isInViewport(figure)) {
          figure.classList.add('visible');
        }
      });
    };

    // Не добавляй fallback, если статические фото уже есть
    const staticImages = Array.from(galleryGrid.querySelectorAll('img')).map(i => i.getAttribute('src'));
    if (staticImages.length === 0) {
      addImages(fallback);
    }

    fetch('assets/images/manifest.json')
      .then(r => r.ok ? r.json() : Promise.reject(new Error('Fail JSON')))
      .then(data => {
        if (data && Array.isArray(data.images)) {
          // Избегай дубликатов: добавь только новые
          const existing = new Set(Array.from(galleryGrid.querySelectorAll('img')).map(i => i.getAttribute('src')));
          const toAdd = data.images.filter(it => !existing.has(it.src));
          if (toAdd.length) addImages(toAdd);
        }
      })
      .catch(() => {/* Уже есть статические фото */});

    // re-observe pentru reveal noile elemente (și setare vizibilă ca fallback)
    document.querySelectorAll('.gallery-item.reveal').forEach(el => {
      io.observe(el);
      // fallback: marchează vizibil după un tick
      setTimeout(() => el.classList.add('visible'), 150);
    });

    // Initializează filtrele
    const filterButtons = document.querySelectorAll('.filter-btn');
    const applyFilter = (cat) => {
      const items = galleryGrid.querySelectorAll('.gallery-item');
      items.forEach(it => {
        const itemCat = it.dataset.category || 'Altele';
        if (cat === 'all' || itemCat === cat) it.classList.remove('hidden');
        else it.classList.add('hidden');
      });
    };
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        applyFilter(btn.dataset.filter);
      });
    });
    // Ensure static items have reveal + click for lightbox
    galleryGrid.querySelectorAll('figure.gallery-item').forEach(fig => {
      if (!fig.classList.contains('reveal')) fig.classList.add('reveal');
      const img = fig.querySelector('img');
      const title = fig.querySelector('figcaption strong')?.textContent || '';
      const cap = fig.querySelector('figcaption span')?.textContent || '';
      fig.addEventListener('click', () => openLightbox(img.src, img.alt, title, cap));
      // observe
      io.observe(fig);
      setTimeout(() => fig.classList.add('visible'), 150);
    });
  }
});