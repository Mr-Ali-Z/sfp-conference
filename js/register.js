(function () {
  var form = document.getElementById('register-form');
  if (!form) return;

  var success = document.getElementById('success');
  var emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var phoneRx = /^[+\d][\d\s\-]{6,}$/;

  // Highlight selected radio option visually
  var radios = form.querySelectorAll('input[name="ticket"]');
  radios.forEach(function (r) {
    r.addEventListener('change', function () {
      form.querySelectorAll('.radio-option').forEach(function (o) {
        o.classList.remove('selected');
      });
      r.closest('.radio-option').classList.add('selected');
    });
  });

  function setInvalid(row, on) {
    if (on) row.classList.add('invalid');
    else row.classList.remove('invalid');
  }

  function validate() {
    var ok = true;
    var firstBad = null;

    var fullname = form.fullname;
    var rowName = fullname.closest('.form-row');
    if (!fullname.value.trim()) { setInvalid(rowName, true); ok = false; firstBad = firstBad || fullname; }
    else setInvalid(rowName, false);

    var email = form.email;
    var rowEmail = email.closest('.form-row');
    if (!emailRx.test(email.value.trim())) { setInvalid(rowEmail, true); ok = false; firstBad = firstBad || email; }
    else setInvalid(rowEmail, false);

    var phone = form.phone;
    var rowPhone = phone.closest('.form-row');
    if (!phoneRx.test(phone.value.trim())) { setInvalid(rowPhone, true); ok = false; firstBad = firstBad || phone; }
    else setInvalid(rowPhone, false);

    var ticketChecked = form.querySelector('input[name="ticket"]:checked');
    var rowTicket = form.querySelector('input[name="ticket"]').closest('.form-row');
    if (!ticketChecked) { setInvalid(rowTicket, true); ok = false; firstBad = firstBad || form.querySelector('input[name="ticket"]'); }
    else setInvalid(rowTicket, false);

    var consent = form.consent;
    var consentErr = document.getElementById('err-consent');
    if (!consent.checked) {
      consentErr.style.display = 'block';
      ok = false;
      firstBad = firstBad || consent;
    } else {
      consentErr.style.display = 'none';
    }

    if (!ok && firstBad) firstBad.focus();
    return ok;
  }

  // live re-validate on blur for nicer feel
  ['fullname','email','phone'].forEach(function (n) {
    var el = form[n];
    if (!el) return;
    el.addEventListener('blur', function () {
      var row = el.closest('.form-row');
      var v = el.value.trim();
      if (!v && el.required) setInvalid(row, true);
      else if (n === 'email' && !emailRx.test(v)) setInvalid(row, true);
      else if (n === 'phone' && !phoneRx.test(v)) setInvalid(row, true);
      else setInvalid(row, false);
    });
  });

  function saveSubmission() {
    var record = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      fullname: form.fullname.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      organisation: form.org.value.trim(),
      ticket: (form.querySelector('input[name="ticket"]:checked') || {}).value || '',
      dietary: form.dietary.value.trim(),
      consent: form.consent.checked
    };
    var key = 'sfp_registrations';
    var list = [];
    try {
      list = JSON.parse(localStorage.getItem(key) || '[]');
      if (!Array.isArray(list)) list = [];
    } catch (e) { list = []; }
    list.push(record);
    try { localStorage.setItem(key, JSON.stringify(list)); }
    catch (e) { console.warn('Could not save registration locally:', e); }
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate()) return;
    saveSubmission();
    success.classList.add('show');
    success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    form.reset();
    form.querySelectorAll('.radio-option').forEach(function (o) { o.classList.remove('selected'); });
    setTimeout(function () { success.classList.remove('show'); }, 8000);
  });
})();
