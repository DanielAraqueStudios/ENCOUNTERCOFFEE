// Video carousel: keeps the original two-video side-by-side layout.
// Each slot independently cycles through all videos in sequence when its video ends.
// Slot 0 starts at video[0], slot 1 starts at video[1], so they always show different videos.
(function () {

  function initVideoCarousel() {
    var grid = document.getElementById('videos-grid');
    if (!grid) return;

    var blocks = Array.prototype.slice.call(grid.querySelectorAll('.media-image-block'));
    if (blocks.length === 0) return;

    // Collect all source URLs in order from the blocks
    var sources = blocks.map(function (block) {
      var s = block.querySelector('source');
      return s ? s.getAttribute('src') : null;
    }).filter(Boolean);

    if (sources.length === 0) return;

    // Restore original flex layout (undo any single-column override)
    grid.style.display = '';

    blocks.forEach(function (block, blockIndex) {
      var video = block.querySelector('video');
      if (!video) return;

      // Remove individual loop — we control advancement
      video.loop = false;
      video.removeAttribute('loop');

      // Each slot starts at its own offset so they show different videos
      var cursor = blockIndex % sources.length;

      function advance() {
        cursor = (cursor + 1) % sources.length;
        var source = video.querySelector('source');
        if (source) source.setAttribute('src', sources[cursor]);
        video.load();
        video.play().catch(function () {});
      }

      // Use property assignment so re-calls don't stack listeners
      video.onended = advance;
      video.play().catch(function () {});
    });
  }

  window.initVideoCarousel = initVideoCarousel;

  document.addEventListener('DOMContentLoaded', initVideoCarousel);
})();
