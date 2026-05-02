(function () {
  var toggles = document.querySelectorAll('.bio-toggle');
  toggles.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var card = btn.closest('.card');
      var bio = card.querySelector('.speaker-bio');
      var expanded = bio.classList.toggle('expanded');
      btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      btn.textContent = expanded ? 'Read less' : 'Read more';
    });
  });
})();
