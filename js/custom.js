
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

    // MAGNETIC HOVER ANIMATION - Modern & Unique
    const interactiveContainer = document.getElementById('clockContainer');
    const valueItems = document.querySelectorAll('.value-item.clock-position');
    const cursorGlow = document.getElementById('clockHand');

    console.log('🎨 Animation Init:', {
      container: !!interactiveContainer,
      items: valueItems.length,
      glow: !!cursorGlow
    });

    if (interactiveContainer && valueItems.length > 0) {
      
      console.log('✨ Setting up magnetic animation!');
      
      // Store original positions and set initial transforms
      const itemPositions = [];
      valueItems.forEach((item, index) => {
        const angle = parseFloat(item.getAttribute('data-angle'));
        
        // Set initial position immediately
        const baseTransform = `translate(-50%, -50%) rotate(${angle}deg) translateX(180px) rotate(-${angle}deg)`;
        item.style.transform = baseTransform;
        
        console.log(`📍 Item ${index} at ${angle}°`);
        
        itemPositions.push({
          element: item,
          angle: angle,
          baseTransform: baseTransform,
          currentX: 0,
          currentY: 0,
          targetX: 0,
          targetY: 0,
          scale: 1,
          targetScale: 1
        });
      });

      let mouseX = 0;
      let mouseY = 0;
      let isHovering = false;

      // Mouse move - magnetic attraction
      let moveCount = 0;
      interactiveContainer.addEventListener('mousemove', (e) => {
        const rect = interactiveContainer.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        mouseX = e.clientX - centerX;
        mouseY = e.clientY - centerY;
        isHovering = true;
        
        if (moveCount === 0) {
          console.log('🖱️ Mouse tracking active!');
        }
        moveCount++;

        // Update cursor glow position
        if (cursorGlow) {
          const glowX = ((e.clientX - rect.left) / rect.width) * 100;
          const glowY = ((e.clientY - rect.top) / rect.height) * 100;
          cursorGlow.style.left = glowX + '%';
          cursorGlow.style.top = glowY + '%';
          cursorGlow.style.opacity = '1';
        }
      });

      // Mouse leave - reset
      interactiveContainer.addEventListener('mouseleave', () => {
        isHovering = false;
        itemPositions.forEach(item => {
          item.targetX = 0;
          item.targetY = 0;
          item.targetScale = 1;
        });
        
        if (cursorGlow) {
          cursorGlow.style.opacity = '0';
        }
      });

      // Animation loop
      function animateMagnetic() {
        itemPositions.forEach((item, index) => {
          // Calculate item's actual position in the container
          const rect = item.element.getBoundingClientRect();
          const containerRect = interactiveContainer.getBoundingClientRect();
          const itemCenterX = (rect.left + rect.width / 2) - (containerRect.left + containerRect.width / 2);
          const itemCenterY = (rect.top + rect.height / 2) - (containerRect.top + containerRect.height / 2);

          if (isHovering) {
            // Calculate distance from mouse to item
            const deltaX = mouseX - itemCenterX;
            const deltaY = mouseY - itemCenterY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            
            // Magnetic pull strength (stronger when closer)
            const maxDistance = 300;
            const pullStrength = Math.max(0, 1 - (distance / maxDistance));
            
            // Calculate magnetic offset
            item.targetX = deltaX * pullStrength * 0.3;
            item.targetY = deltaY * pullStrength * 0.3;
            
            // Scale based on proximity
            if (distance < 120) {
              item.targetScale = 1 + (pullStrength * 0.3);
              item.element.classList.add('active');
              item.element.classList.remove('highlighted');
            } else if (distance < 200) {
              item.targetScale = 1 + (pullStrength * 0.15);
              item.element.classList.remove('active');
              item.element.classList.add('highlighted');
            } else {
              item.targetScale = 1;
              item.element.classList.remove('active', 'highlighted');
            }
          } else {
            item.element.classList.remove('active', 'highlighted');
          }

          // Smooth easing with elastic feel
          const ease = 0.12;
          item.currentX += (item.targetX - item.currentX) * ease;
          item.currentY += (item.targetY - item.currentY) * ease;
          item.scale += (item.targetScale - item.scale) * ease;

          // Apply transform with magnetic offset
          item.element.style.transform = `
            translate(-50%, -50%) 
            rotate(${item.angle}deg) 
            translateX(180px) 
            rotate(-${item.angle}deg)
            translate(${item.currentX}px, ${item.currentY}px)
            scale(${item.scale})
          `;
        });

        requestAnimationFrame(animateMagnetic);
      }

      // Start animation
      console.log('🚀 Animation loop started!');
      animateMagnetic();

      // Click to pulse effect
      valueItems.forEach((item, index) => {
        item.addEventListener('click', () => {
          item.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
          itemPositions[index].targetScale = 1.4;
          
          setTimeout(() => {
            itemPositions[index].targetScale = 1;
            setTimeout(() => {
              item.style.transition = '';
            }, 300);
          }, 150);
        });
      });
    }
  
  
  })(window.jQuery);


