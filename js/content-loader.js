// Loads dynamic content from the Pure JS/Node.js API and updates DOM elements.
// Gracefully does nothing if the API is not running.
(function () {
  var API = '/api';

  function get(obj, path) {
    return path.split('.').reduce(function (o, k) { return o && o[k]; }, obj);
  }

  var TEXT_MAP = {
    'whatWeDo.heroTitle':             ['wwd-hero-title'],
    'whatWeDo.qualityHumanityHeading':['wwd-qh-heading'],
    'whatWeDo.qualityLabel':          ['wwd-quality-label'],
    'whatWeDo.humanityLabel':         ['wwd-humanity-label'],
    'whatWeDo.team.victor.bio':       ['victor-bio'],
    'whatWeDo.team.johnBlanca.bio':   ['john-blanca-bio'],
    'whatWeDo.team.camila.bio':       ['camila-bio'],
    'whatWeDo.team.nico.bio':         ['nico-bio'],
  };

  document.addEventListener('DOMContentLoaded', function () {

    // ── Text content ──
    fetch(API + '/content')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        // ── Text content injection ──
        Object.keys(TEXT_MAP).forEach(function (keyPath) {
          var value = get(data, keyPath);
          if (!value) return;
          TEXT_MAP[keyPath].forEach(function (id) {
            var el = document.getElementById(id);
            if (el) el.textContent = value;
          });
        });

        // ── Index Hero: Background and Title ──
        if (data.indexHero) {
          var hero = data.indexHero;

          // Update background image
          if (hero.backgroundImage) {
            var heroSection = document.getElementById('encounter_hero');
            if (heroSection) {
              heroSection.style.backgroundImage = 'url(' + hero.backgroundImage + ')';
            }
          }

          // Update title image or text
          var heroMode = hero.mode || 'image';
          var heroText = hero.text || '';
          var heroImg = document.getElementById('hero-title-img');
          var heroTxt = document.getElementById('hero-title-text');

          if (heroImg && heroTxt) {
            if (heroMode === 'text') {
              heroImg.style.display = 'none';
              heroTxt.style.display = 'block';
              heroTxt.textContent = heroText;
            } else {
              if (hero.titleImage) {
                heroImg.src = hero.titleImage;
              }
              heroImg.style.display = '';
              heroTxt.style.display = 'none';
            }
          }
        }

        // ── Index Products ──
        if (Array.isArray(data.indexProducts) && data.indexProducts.length > 0) {
          data.indexProducts.forEach(function (product) {
            var imgElem = document.getElementById('product-img-' + product.id);
            if (imgElem && product.image) {
              imgElem.src = product.image;
            }
          });
        }

        // ── What We Do Hero Images ──
        if (data.whatWeDo && data.whatWeDo.heroImages) {
          var whdHeroImgs = data.whatWeDo.heroImages;

          // Find what-we-do page hero section (different from index)
          var whdPages = document.querySelectorAll('body.theme-blue .encounter-hero-section');
          if (whdPages.length > 0) {
            var whdHero = whdPages[0];

            // Scene 1 images
            var whdScene1Imgs = whdHero.querySelectorAll('[data-scene="1"] .hero-bg-image');
            if (whdScene1Imgs.length >= 2) {
              if (whdHeroImgs.scene1_img1) whdScene1Imgs[0].src = whdHeroImgs.scene1_img1;
              if (whdHeroImgs.scene1_img2) whdScene1Imgs[1].src = whdHeroImgs.scene1_img2;
            }

            // Scene 2 background
            var whdScene2Bg = whdHero.querySelector('[data-scene="2"] .hero-bg-image-static');
            if (whdScene2Bg && whdHeroImgs.scene2_bg) {
              whdScene2Bg.src = whdHeroImgs.scene2_bg;
            }

            // Scene 2 panels
            var whdScene2Panels = whdHero.querySelectorAll('[data-scene="2"] .encounter-left-panel-image');
            if (whdScene2Panels.length >= 2) {
              if (whdHeroImgs.scene2_panel1) whdScene2Panels[0].src = whdHeroImgs.scene2_panel1;
              if (whdScene2Panels[1] && whdHeroImgs.scene2_panel2) whdScene2Panels[1].src = whdHeroImgs.scene2_panel2;
            }
          }
        }

        // ── Team Member Images (What We Do) ──
        if (data.whatWeDo && data.whatWeDo.team) {
          var team = data.whatWeDo.team;

          if (team.victor && team.victor.image) {
            var victorImg = document.getElementById('team-img-victor');
            if (victorImg) victorImg.src = team.victor.image;
          }

          if (team.johnBlanca && team.johnBlanca.image) {
            var johnImg = document.getElementById('team-img-johnblanca');
            if (johnImg) johnImg.src = team.johnBlanca.image;
          }

          if (team.camila && team.camila.image) {
            var camilaImg = document.getElementById('team-img-camila');
            if (camilaImg) camilaImg.src = team.camila.image;
          }

          if (team.nico && team.nico.image) {
            var nicoImg = document.getElementById('team-img-nico');
            if (nicoImg) nicoImg.src = team.nico.image;
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
