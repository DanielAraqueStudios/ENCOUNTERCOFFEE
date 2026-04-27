// Floating Messages Banner - Cycles through 10 key messages about Encounter Coffee
(function () {
  const messages = [
    "We cut out the middlemen — so quality traces from seed to cup, and farmers get paid more.",
    "Tostón de origen.",
    "We don't just buy coffee — we partner with small growers to elevate their craft to world-class.",
    "Nitrogen-sealed drip bags — locked-in freshness for up to 12 months.",
    "15%+ more to growers. Not charity — smart, direct investment in quality and community.",
    "Full control from plant to cup — every detail obsessively crafted for perfection.",
    "Roasted at origin by one of the world's best roasters.",
    "No fixed farm. Just relentless pursuit of excellence — and the freedom to lift up the best small producers.",
    "Compostable pods: break down in weeks, not centuries. Good for your cup, great for the planet.",
    "Small-batch roasted — freshness locked in, flavor maximized."
  ];

  const messagesES = [
    "Eliminamos intermediarios — así la calidad se rastrea de semilla a taza, y los agricultores ganan más.",
    "Tostón de origen.",
    "No solo compramos café — nos asociamos con pequeños cultivadores para elevar su oficio a nivel mundial.",
    "Bolsas de goteo selladas con nitrógeno — la frescura bloqueada hasta por 12 meses.",
    "15%+ más para cultivadores. No es caridad — es una inversión inteligente y directa en calidad y comunidad.",
    "Control total de planta a taza — cada detalle meticulosamente elaborado para la perfección.",
    "Tostado en origen por uno de los mejores tostadores del mundo.",
    "Sin finca fija. Solo la búsqueda implacable de la excelencia — y la libertad de elevar a los mejores pequeños productores.",
    "Cápsulas compostables: se descomponen en semanas, no en siglos. Bueno para tu taza, excelente para el planeta.",
    "Tostado en pequeños lotes — frescura bloqueada, sabor maximizado."
  ];

  let currentIndex = 0;

  function updateMessage() {
    const textElement = document.getElementById('floatingMessagesText');
    if (textElement) {
      const isSpanish = document.documentElement.lang === 'es';
      const messagesList = isSpanish ? messagesES : messages;
      textElement.textContent = messagesList[currentIndex];
      currentIndex = (currentIndex + 1) % messagesList.length;
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    updateMessage();
    // Change message every 5 seconds
    setInterval(updateMessage, 5000);
  });
})();
