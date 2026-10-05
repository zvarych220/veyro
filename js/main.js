(function () {
  'use strict';
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  function setMenu(open) {
    nav.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
  }
  burger.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
  nav.addEventListener('click', function (e) { if (e.target.tagName === 'A') setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  var blocks = document.querySelectorAll('.rv');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) {
    blocks.forEach(function (b) { b.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    blocks.forEach(function (b) { io.observe(b); });
  }

  var form = document.getElementById('form');
  var msg = document.getElementById('form-msg');
  var btn = form.querySelector('button[type=submit]');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = form.elements;
    var ok = true;
    ['name', 'contact'].forEach(function (n) {
      var bad = f[n].value.trim().length < 2;
      f[n].setAttribute('aria-invalid', String(bad));
      if (bad) ok = false;
    });
    if (!ok) { msg.textContent = 'Заповніть імʼя та контакт: Telegram або телефон.'; return; }

    // тип проєкту додається на початок повідомлення, щоб /api/lead не довелось змінювати
    var type = f.type && f.type.value ? '[' + f.type.value + '] ' : '';
    var data = {
      name: f.name.value.trim(),
      contact: f.contact.value.trim(),
      message: type + f.message.value.trim(),
      botcheck: f.botcheck.value
    };
    btn.disabled = true;
    msg.textContent = 'Надсилаю…';
    fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(function (r) {
      if (!r.ok) throw new Error('send');
      msg.textContent = 'Дякую, відповім найближчим часом.';
      form.reset();
    }).catch(function () {
      msg.textContent = 'Не вдалось надіслати. Напишіть мені в Telegram.';
    }).then(function () { btn.disabled = false; });
  });

  // підсвітка карток за курсором (тільки для пристроїв із наведенням)
  var fine = window.matchMedia('(hover: hover)').matches && !reduce;
  if (fine) {
    document.addEventListener('pointermove', function (e) {
      var t = e.target.closest && e.target.closest('.card, .feat li');
      if (!t) return;
      var r = t.getBoundingClientRect();
      t.style.setProperty('--cx', (e.clientX - r.left) + 'px');
      t.style.setProperty('--cy', (e.clientY - r.top) + 'px');
    });
  }

  var num = document.querySelector('[data-count]');
  if (num && !reduce) {
    var to = +num.getAttribute('data-count'), t0 = performance.now();
    num.textContent = '0';
    requestAnimationFrame(function tick(t) {
      var p = Math.max(0, Math.min((t - t0 - 300) / 1400, 1));
      num.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    });
  }

  var chat = document.getElementById('chat');
  if (chat) {
    document.documentElement.classList.add('js');
    var chips = document.getElementById('chips'), busy = false;
    chat.querySelectorAll('.turn').forEach(function (t) {
      var a = t.querySelector('.a'), dots = t.querySelector('.dots'), b = document.createElement('button');
      a.hidden = true;
      b.type = 'button'; b.className = 'chip'; b.textContent = t.querySelector('.q').textContent;
      b.addEventListener('click', function () {
        if (busy || b.disabled) return;
        busy = true; b.disabled = true;
        t.classList.add('show'); dots.hidden = false;
        chat.scrollTop = chat.scrollHeight;
        setTimeout(function () {
          dots.hidden = true; a.hidden = false; busy = false;
          chat.scrollTop = chat.scrollHeight;
        }, reduce ? 0 : 800);
      });
      chips.appendChild(b);
    });
  }
})();