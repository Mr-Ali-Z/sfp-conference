(function () {
  var toggle = document.querySelector('.nav-toggle');
  var list = document.getElementById('primary-nav');
  if (!toggle || !list) return;

  toggle.addEventListener('click', function () {
    var open = list.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  document.addEventListener('click', function (e) {
    if (!list.classList.contains('open')) return;
    if (list.contains(e.target) || toggle.contains(e.target)) return;
    list.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && list.classList.contains('open')) {
      list.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.focus();
    }
  });
})();
