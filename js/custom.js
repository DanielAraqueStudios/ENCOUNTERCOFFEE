
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

    // CLOCK-STYLE BRAND STATEMENT ANIMATION
    const clockContainer = document.getElementById('clockContainer');
    const clockHand = document.getElementById('clockHand');
    const valueItems = document.querySelectorAll('.value-item.clock-position');

    if (clockContainer && clockHand && valueItems.length > 0) {
      let currentAngle = 0;
      let targetAngle = 0;

      // Check if user prefers reduced motion
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (!prefersReducedMotion) {
        
        // Mouse move event - calculate angle based on mouse position
        clockContainer.addEventListener('mousemove', (e) => {
          const rect = clockContainer.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          
          // Calculate angle from center to mouse
          const deltaX = e.clientX - centerX;
          const deltaY = e.clientY - centerY;
          
          // Convert to degrees (0° = right, 90° = bottom, 180° = left, 270° = top)
          let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
          
          // Normalize angle to 0-360 range
          if (angle < 0) angle += 360;
          
          targetAngle = angle;
        });

        // Reset to default position when mouse leaves
        clockContainer.addEventListener('mouseleave', () => {
          targetAngle = 0;
        });

        // Function to check if an item is near the clock hand
        function isItemNearHand(itemAngle, handAngle) {
          // Normalize angles
          const normalizedItemAngle = itemAngle % 360;
          const normalizedHandAngle = handAngle % 360;
          
          // Calculate angular distance
          let distance = Math.abs(normalizedItemAngle - normalizedHandAngle);
          if (distance > 180) distance = 360 - distance;
          
          // Item is "near" if within 30 degrees
          return distance < 30;
        }

        // Function to check if item is directly under hand (active)
        function isItemActive(itemAngle, handAngle) {
          const normalizedItemAngle = itemAngle % 360;
          const normalizedHandAngle = handAngle % 360;
          
          let distance = Math.abs(normalizedItemAngle - normalizedHandAngle);
          if (distance > 180) distance = 360 - distance;
          
          // Item is "active" if within 15 degrees
          return distance < 15;
        }

        // Animation loop with smooth easing
        function animateClock() {
          // Smooth easing towards target angle
          const diff = targetAngle - currentAngle;
          currentAngle += diff * 0.1;

          // Rotate clock hand
          clockHand.style.transform = `translate(0, -50%) rotate(${currentAngle}deg)`;

          // Update value items based on clock hand position
          valueItems.forEach(item => {
            const itemAngle = parseFloat(item.getAttribute('data-angle'));
            
            // Remove all states first
            item.classList.remove('active', 'highlighted');
            
            // Check if item is active (directly under hand)
            if (isItemActive(itemAngle, currentAngle)) {
              item.classList.add('active');
            }
            // Check if item is near the hand (highlighted)
            else if (isItemNearHand(itemAngle, currentAngle)) {
              item.classList.add('highlighted');
            }
          });

          requestAnimationFrame(animateClock);
        }

        // Start animation
        animateClock();

        // Optional: Click on items to rotate hand to that position
        valueItems.forEach(item => {
          item.addEventListener('click', () => {
            const angle = parseFloat(item.getAttribute('data-angle'));
            targetAngle = angle;
          });
        });
      }
    }
  
  })(window.jQuery);


