// Loads dynamic content from the Next.js API and updates DOM elements.
// Gracefully does nothing if the API is not running.
(function () {
  var API = 'http://localhost:3001/api';

  function get(obj, path) {
    return path.split('.').reduce(function (o, k) { return o && o[k]; }, obj);
  }

  var TEXT_MAP = {
    'whatWeDo.heroTitle':             ['wwd-hero-title'],
    'whatWeDo.qualityHumanityHeading':['wwd-qh-heading'],
    'whatWeDo.qualityLabel':          ['wwd-quality-label'],
    'whatWeDo.humanityLabel':         ['wwd-humanity-label'],
    'whatWeDo.victorBio':             ['victor-bio'],
    'whatWeDo.johnBlancaBio':         ['john-blanca-bio'],
    'whatWeDo.camilaBio':             ['camila-bio'],
    'whatWeDo.nicoBio':               ['nico-bio'],
  };

  document.addEventListener('DOMContentLoaded', function () {

    // ── Text content ──
    fetch(API + '/content')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        Object.keys(TEXT_MAP).forEach(function (keyPath) {
          var value = get(data, keyPath);
          if (!value) return;
          TEXT_MAP[keyPath].forEach(function (id) {
            var el = document.getElementById(id);
            if (el) el.textContent = value;
          });
        });

        // ── Homepage hero title: image vs text mode ──
        var heroMode = get(data, 'indexHero.mode') || 'image';
        var heroText = get(data, 'indexHero.text') || '';
        var heroImg  = document.getElementById('hero-title-img');
        var heroTxt  = document.getElementById('hero-title-text');
        if (heroImg && heroTxt) {
          if (heroMode === 'text') {
            heroImg.style.display = 'none';
            heroTxt.style.display = 'block';
            heroTxt.textContent = heroText;
          } else {
            heroImg.style.display = '';
            heroTxt.style.display = 'none';
          }
        }
      })
      .catch(function () { /* API not running — keep hardcoded HTML */ });

    // ── Videos ──
    fetch(API + '/videos')
      .then(function (r) { return r.json(); })
      .then(function (videos) {
        var container = document.getElementById('videos-grid');
        if (!container || !Array.isArray(videos) || videos.length === 0) return;

        container.innerHTML = videos.map(function (v, i) {
          var arrow = i > 0 ? '<div class="media-arrow"><i class="bi bi-arrow-right"></i></div>' : '';
          return arrow + '<div class="media-image-block">' +
            '<video class="img-fluid" muted playsinline>' +
            '<source src="images/Home/Fotos_a_usar/' + v.filename + '" type="video/mp4">' +
            '</video></div>';
        }).join('');

        // Re-init carousel with the new video list
        if (typeof window.initVideoCarousel === 'function') {
          window.initVideoCarousel();
        }
      })
      .catch(function () { /* keep hardcoded HTML */ });

  });
})();
