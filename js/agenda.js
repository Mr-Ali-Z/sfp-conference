(function () {
  var dayTabs = document.querySelectorAll('.day-tab');
  var trackPills = document.querySelectorAll('.track-pill');
  var sessions = document.querySelectorAll('.session');
  var empty = document.getElementById('empty-state');

  var currentDay = '1';
  var currentTrack = 'all';

  function apply() {
    var visible = 0;
    sessions.forEach(function (s) {
      var day = s.getAttribute('data-day');
      var track = s.getAttribute('data-track');
      var dayMatch = day === currentDay;
      var trackMatch = currentTrack === 'all' || track === currentTrack || track === 'all';
      if (dayMatch && trackMatch) {
        s.classList.remove('hidden');
        visible++;
      } else {
        s.classList.add('hidden');
      }
    });
    if (empty) empty.style.display = visible === 0 ? 'block' : 'none';
  }

  dayTabs.forEach(function (t) {
    t.addEventListener('click', function () {
      dayTabs.forEach(function (x) {
        x.classList.remove('active');
        x.setAttribute('aria-selected', 'false');
      });
      t.classList.add('active');
      t.setAttribute('aria-selected', 'true');
      currentDay = t.getAttribute('data-day');
      apply();
    });
  });

  trackPills.forEach(function (p) {
    p.addEventListener('click', function () {
      trackPills.forEach(function (x) { x.classList.remove('active'); });
      p.classList.add('active');
      currentTrack = p.getAttribute('data-track');
      apply();
    });
  });

  apply();
})();
