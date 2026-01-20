
  (function ($) {
  
  "use strict";

    // MENU
    $('.navbar-collapse a').on('click',function(){
      $(".navbar-collapse").collapse('hide');
    });
    
    // CUSTOM LINK
    $('.smoothscroll').click(function(){
      var el = $(this).attr('href');
      var elWrapped = $(el);
      var header_height = $('.navbar').height();
  
      scrollToDiv(elWrapped,header_height);
      return false;
  
      function scrollToDiv(element,navheight){
        var offset = element.offset();
        var offsetTop = offset.top;
        var totalScroll = offsetTop-navheight;
  
        $('body,html').animate({
        scrollTop: totalScroll
        }, 300);
      }
    });

    // HERO CAROUSEL FUNCTIONALITY
    let currentSlide = 0;
    const cards = document.querySelectorAll('.carousel-card');
    const totalSlides = cards.length;
    const progressBar = document.getElementById('progressBar');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    function updateCarousel() {
      cards.forEach((card, index) => {
        card.classList.remove('active');
        if (index === currentSlide) {
          card.classList.add('active');
        }
      });

      // Update progress bar
      if (progressBar) {
        const progress = ((currentSlide + 1) / totalSlides) * 100;
        progressBar.style.width = progress + '%';
      }

      // Scroll to active card
      const activeCard = cards[currentSlide];
      if (activeCard) {
        activeCard.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }

    function nextSlide() {
      currentSlide = (currentSlide + 1) % totalSlides;
      updateCarousel();
    }

    function prevSlide() {
      currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
      updateCarousel();
    }

    // Event listeners
    if (nextBtn) {
      nextBtn.addEventListener('click', nextSlide);
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', prevSlide);
    }

    // Auto-advance carousel every 5 seconds
    let autoAdvance = setInterval(nextSlide, 5000);

    // Pause auto-advance on hover
    const carouselContainer = document.getElementById('heroCarousel');
    if (carouselContainer) {
      carouselContainer.addEventListener('mouseenter', () => {
        clearInterval(autoAdvance);
      });

      carouselContainer.addEventListener('mouseleave', () => {
        autoAdvance = setInterval(nextSlide, 5000);
      });
    }

    // Initialize carousel
    if (cards.length > 0) {
      updateCarousel();
    }

    // BRAND STATEMENT PARALLAX EFFECT
    const interactiveVisual = document.getElementById('interactiveVisual');
    const semicircleArc = document.getElementById('semicircleArc');
    const valueList = document.getElementById('valueList');

    if (interactiveVisual && semicircleArc && valueList) {
      let mouseX = 0;
      let mouseY = 0;
      let targetX = 0;
      let targetY = 0;

      // Check if user prefers reduced motion
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (!prefersReducedMotion) {
        interactiveVisual.addEventListener('mousemove', (e) => {
          const rect = interactiveVisual.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          
          // Calculate mouse position relative to center
          mouseX = (e.clientX - centerX) / rect.width;
          mouseY = (e.clientY - centerY) / rect.height;
        });

        interactiveVisual.addEventListener('mouseleave', () => {
          mouseX = 0;
          mouseY = 0;
        });

        // Smooth animation loop
        function animateParallax() {
          // Smooth easing
          targetX += (mouseX - targetX) * 0.1;
          targetY += (mouseY - targetY) * 0.1;

          // Apply transforms with different intensities for depth
          const semicircleX = targetX * 30;
          const semicircleY = targetY * 30;
          const listX = targetX * 20;
          const listY = targetY * 20;

          semicircleArc.style.transform = `translateY(-50%) translate(${semicircleX}px, ${semicircleY}px)`;
          valueList.style.transform = `translate(-50%, -50%) translate(${listX}px, ${listY}px)`;

          requestAnimationFrame(animateParallax);
        }

        animateParallax();
      }
    }
  
  })(window.jQuery);


