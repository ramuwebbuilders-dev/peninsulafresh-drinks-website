/* Peninsula Fresh - site scripts. Set your real contact details here. */
var CONFIG = { email: 'info@peninsulafresh.lk', whatsapp: '' /* e.g. '94771234567' */ };
document.addEventListener('DOMContentLoaded', function () {
  var $ = function (s, r) { return (r || document).querySelector(s); }, $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  // mobile menu
  var mt = $('.mt'), nav = $('.nav');
  if (mt && nav) {
    mt.addEventListener('click', function () { mt.classList.toggle('open'); nav.classList.toggle('open'); mt.setAttribute('aria-expanded', mt.classList.contains('open')); });
    $$('a', nav).forEach(function (a) { a.addEventListener('click', function () { mt.classList.remove('open'); nav.classList.remove('open'); }); });
  }
  // header shadow
  var h = $('.hdr'); if (h) { var f = function () { h.classList.toggle('sc', window.scrollY > 8); }; f(); window.addEventListener('scroll', f, { passive: true }); }
  // count-up (final value is already in the HTML, so nothing is ever hidden)
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return; io.unobserve(e.target);
        var el = e.target, t = parseInt(el.getAttribute('data-n'), 10), sfx = el.getAttribute('data-s') || '', t0 = performance.now();
        (function st(n) { var p = Math.min((n - t0) / 1000, 1); el.textContent = Math.round(t * (1 - Math.pow(1 - p, 3))) + sfx; if (p < 1) requestAnimationFrame(st); })(t0);
      });
    }, { threshold: .5 });
    $$('[data-n]').forEach(function (el) { io.observe(el); });
  }
  // product filter
  $$('.tabs button').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('.tabs button').forEach(function (x) { x.classList.remove('on'); }); b.classList.add('on');
      var k = b.getAttribute('data-f');
      $$('.pc').forEach(function (c) { c.hidden = !(k === 'all' || c.getAttribute('data-c') === k); });
    });
  });
  // front / back toggle
  $$('.flip').forEach(function (b) {
    b.addEventListener('click', function () { var p = b.parentNode, on = p.classList.toggle('sb'); b.textContent = on ? 'View front' : 'View back'; });
  });
  // quote form
  var q = $('#quote');
  if (q) {
    var pre = new URLSearchParams(window.location.search).get('product'), sel = $('#product', q);
    if (pre && sel) { $$('option', sel).forEach(function (o) { if (o.value === pre) sel.value = pre; }); }
    var msg = $('.msg', q), wa = $('#wa', q);
    if (wa && !CONFIG.whatsapp) wa.style.display = 'none';
    var build = function () {
      var v = function (id) { return ($('#' + id, q).value || '').trim(); };
      return 'New quote request\n\nName: ' + v('name') + '\nCompany: ' + (v('company') || '-') + '\nEmail: ' + v('email') + '\nPhone: ' + (v('phone') || '-') + '\nProduct: ' + v('product') + '\nQuantity: ' + (v('qty') || '-') + '\n\nMessage:\n' + (v('message') || '-');
    };
    var check = function () {
      var ok = true, first = null, em = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      ['name', 'email'].forEach(function (id) { $('#' + id, q).classList.remove('er'); });
      var n = $('#name', q), e = $('#email', q);
      if (!n.value.trim()) { n.classList.add('er'); ok = false; first = first || n; }
      if (!em.test(e.value.trim())) { e.classList.add('er'); ok = false; first = first || e; }
      if (!ok) { msg.textContent = 'Please enter your name and a valid email address.'; msg.className = 'msg no show'; first.focus(); }
      return ok;
    };
    q.addEventListener('submit', function (ev) {
      ev.preventDefault(); if (!check()) return;
      window.location.href = 'mailto:' + CONFIG.email + '?subject=' + encodeURIComponent('Quote request - ' + $('#product', q).value) + '&body=' + encodeURIComponent(build());
      msg.textContent = 'Opening your email app with the request pre-filled. Just press send.'; msg.className = 'msg ok show';
    });
    if (wa) wa.addEventListener('click', function () { if (check()) window.open('https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(build()), '_blank'); });
  }
  $$('.yr').forEach(function (e) { e.textContent = new Date().getFullYear(); });
});
