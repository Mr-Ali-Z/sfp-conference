(function () {
  var STORAGE_KEY = 'sfp_registrations';
  var SESSION_KEY = 'sfp_admin_session';
  var DEMO_PASSWORD = 'sfp2026';

  var loginSection = document.getElementById('login-section');
  var dashboardSection = document.getElementById('dashboard-section');
  var loginForm = document.getElementById('login-form');
  var pwInput = document.getElementById('admin-password');
  var loginErr = document.getElementById('login-err');
  var logoutBtn = document.getElementById('logout-btn');

  var dataBody = document.getElementById('data-body');
  var dataTable = document.getElementById('data-table');
  var emptyState = document.getElementById('empty-state');
  var searchInput = document.getElementById('search-input');
  var ticketFilter = document.getElementById('ticket-filter');
  var exportBtn = document.getElementById('export-btn');
  var clearBtn = document.getElementById('clear-btn');

  function readSubmissions() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY) || '[]';
      var list = JSON.parse(raw);
      return Array.isArray(list) ? list : [];
    } catch (e) { return []; }
  }

  function isLoggedIn() {
    return sessionStorage.getItem(SESSION_KEY) === 'true';
  }

  function showDashboard() {
    loginSection.hidden = true;
    dashboardSection.hidden = false;
    render();
  }

  function showLogin() {
    loginSection.hidden = false;
    dashboardSection.hidden = true;
    pwInput.value = '';
    loginErr.textContent = '';
  }

  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    if (pwInput.value === DEMO_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, 'true');
      showDashboard();
    } else {
      loginErr.textContent = 'Incorrect password.';
      pwInput.focus();
      pwInput.select();
    }
  });

  logoutBtn.addEventListener('click', function () {
    sessionStorage.removeItem(SESSION_KEY);
    showLogin();
  });

  function escapeHtml(s) {
    if (s == null) return '';
    return String(s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }

  function fmtDate(iso) {
    if (!iso) return '';
    try {
      var d = new Date(iso);
      return d.toLocaleString('en-GB', {
        year: 'numeric', month: 'short', day: '2-digit',
        hour: '2-digit', minute: '2-digit'
      });
    } catch (e) { return iso; }
  }

  function ticketTag(t) {
    var label = t ? (t.charAt(0).toUpperCase() + t.slice(1)) : '—';
    return '<span class="ticket-tag ticket-' + escapeHtml(t || 'standard') + '">' + escapeHtml(label) + '</span>';
  }

  function applyFilter(list) {
    var q = (searchInput.value || '').trim().toLowerCase();
    var tk = ticketFilter.value;
    return list.filter(function (r) {
      if (tk !== 'all' && r.ticket !== tk) return false;
      if (!q) return true;
      var hay = [r.fullname, r.email, r.phone, r.organisation].join(' ').toLowerCase();
      return hay.indexOf(q) !== -1;
    });
  }

  function updateStats(list) {
    document.getElementById('count-total').textContent = list.length;
    var counts = { standard: 0, student: 0, industry: 0, press: 0 };
    list.forEach(function (r) { if (counts[r.ticket] !== undefined) counts[r.ticket]++; });
    document.getElementById('count-standard').textContent = counts.standard;
    document.getElementById('count-student').textContent = counts.student;
    document.getElementById('count-industry').textContent = counts.industry;
    document.getElementById('count-press').textContent = counts.press;
  }

  function render() {
    var all = readSubmissions();
    updateStats(all);
    var filtered = applyFilter(all);
    if (all.length === 0) {
      dataTable.style.display = 'none';
      emptyState.hidden = false;
      return;
    }
    dataTable.style.display = '';
    emptyState.hidden = true;
    var rows = filtered.map(function (r, i) {
      return (
        '<tr>' +
        '<td data-label="#">' + (i + 1) + '</td>' +
        '<td data-label="Submitted">' + escapeHtml(fmtDate(r.timestamp)) + '</td>' +
        '<td data-label="Name">' + escapeHtml(r.fullname) + '</td>' +
        '<td data-label="Email">' + escapeHtml(r.email) + '</td>' +
        '<td data-label="Phone">' + escapeHtml(r.phone) + '</td>' +
        '<td data-label="Organisation">' + escapeHtml(r.organisation || '—') + '</td>' +
        '<td data-label="Ticket">' + ticketTag(r.ticket) + '</td>' +
        '<td data-label="Dietary">' + escapeHtml(r.dietary || '—') + '</td>' +
        '</tr>'
      );
    }).join('');
    dataBody.innerHTML = rows || '<tr><td colspan="8" style="text-align:center;color:var(--slate-soft);padding:30px;">No matches for the current filter.</td></tr>';
  }

  function exportCsv() {
    var list = readSubmissions();
    if (list.length === 0) { alert('No registrations to export.'); return; }
    var headers = ['ID','Timestamp','Name','Email','Phone','Organisation','Ticket','Dietary','Consent'];
    var lines = [headers.join(',')];
    list.forEach(function (r) {
      var row = [r.id, r.timestamp, r.fullname, r.email, r.phone, r.organisation, r.ticket, r.dietary, r.consent];
      lines.push(row.map(function (v) {
        if (v == null) return '';
        var s = String(v).replace(/"/g, '""');
        return /[",\n]/.test(s) ? '"' + s + '"' : s;
      }).join(','));
    });
    var blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'sfp_registrations_' + new Date().toISOString().slice(0,10) + '.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function clearAll() {
    if (!confirm('Are you sure you want to delete ALL registrations? This cannot be undone.')) return;
    localStorage.removeItem(STORAGE_KEY);
    render();
  }

  searchInput.addEventListener('input', render);
  ticketFilter.addEventListener('change', render);
  exportBtn.addEventListener('click', exportCsv);
  clearBtn.addEventListener('click', clearAll);

  // Re-render when localStorage changes in another tab
  window.addEventListener('storage', function (e) {
    if (e.key === STORAGE_KEY && isLoggedIn()) render();
  });

  // Boot
  if (isLoggedIn()) showDashboard();
  else showLogin();
})();
