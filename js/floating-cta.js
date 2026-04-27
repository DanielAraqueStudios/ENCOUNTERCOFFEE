// Floating CTA Banner - Cycles through 5 call-to-action messages
(function () {
  const ctaMessages = [
    "We believe the world deserves the very best — and it can be done the right way.",
    "Exceptional Colombian coffee for you. A fairer world for growers.",
    "For world-changers who refuse average mornings.",
    "Coffee is more than a drink. It's an encounter — with yourself, with those you love, with life itself. And with a better world. This is the coffee that makes it all happen.",
    "In a screen-filled world, we brew meaningful encounters."
  ];

  const ctaMessagesES = [
    "Creemos que el mundo merece lo mejor — y se puede hacer de la manera correcta.",
    "Café colombiano excepcional para ti. Un mundo más justo para los cultivadores.",
    "Para los que cambian el mundo y rechazan mañanas mediocres.",
    "El café es más que una bebida. Es un encuentro — contigo mismo, con los que amas, con la vida misma. Y con un mundo mejor. Este es el café que hace que todo suceda.",
    "En un mundo lleno de pantallas, preparamos encuentros significativos."
  ];

  let currentIndex = 0;

  function updateCTA() {
    const textElement = document.getElementById('floatingCtaText');
    if (textElement) {
      const isSpanish = document.documentElement.lang === 'es' || document.body.classList.contains('theme-blue');
      const messages = isSpanish ? ctaMessagesES : ctaMessages;
      textElement.textContent = messages[currentIndex];
      currentIndex = (currentIndex + 1) % messages.length;
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    updateCTA();
    // Change message every 5 seconds
    setInterval(updateCTA, 5000);
  });
})();
