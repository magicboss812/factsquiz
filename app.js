(function () {
  'use strict';
  var F = window.FAKTEN, META = window.META;
  var view = document.getElementById('view');
  var COLS = { z: META.cols[0], f: META.cols[1], b: META.cols[2] };
  var SHORT = { z: 'Zeitpunkt', f: 'Fakt', b: 'Bedeutung' };
  var MONATE = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
  var FILL = 'Lorem ipsum dolor sit amet consetetur sadipscing elitr sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat sed diam voluptua at vero eos et accusam et justo duo dolores et ea rebum stet clita kasd gubergren no sea takimata sanctus est lorem ipsum dolor sit amet consetetur sadipscing elitr sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat sed diam voluptua at vero eos et accusam.';
  var SEITE = { alli: 'Alliierte gemeinsam', west: 'Westen', ost: 'Osten', beide: 'Ost und West' };
  var onKey = null;

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  }
  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function range(n) { var a = []; for (var i = 0; i < n; i++) a.push(i); return a; }
  function newDeck(prev) {
    var d = shuffle(range(F.length));
    if (d[0] === prev && d.length > 1) d.push(d.shift());
    return d;
  }
  function $(sel) { return view.querySelector(sel); }
  function on(sel, fn) { Array.prototype.forEach.call(view.querySelectorAll(sel), function (n) { n.addEventListener('click', function (e) { fn(n, e); }); }); }
  function tag(a) { return '<span class="tag"><i class="dot" aria-hidden="true"></i>' + SEITE[a] + '</span>'; }
  function phaseLine(i) {
    var j = phaseOf(i), ph = META.phasen[j];
    return '<p class="phase-line"><span class="phase-num">Phase ' + (j + 1) + ' · ' + esc(ph[1]) + '</span> ' + esc(ph[2]) + '</p>';
  }
  /* Ereigniskarte. o.part(k) liefert für 'z', 'f' oder 'b' eigenes HTML statt des Inhalts. */
  function evCard(i, o) {
    o = o || {};
    var f = F[i], part = o.part || function () { return null; };
    var z = part('z'), fv = part('f'), bv = part('b');
    var head = z !== null ? z : '<div class="ev-meta"><span class="ev-date">' + esc(f.d) + '</span>' + tag(f.a) + '</div><h3 class="ev-name">' + esc(f.n) + '</h3>';
    return '<article class="ev-card ' + (z !== null ? 's-none' : 's-' + f.a) + (o.cls ? ' ' + o.cls : '') + '">' +
      '<header class="ev-head">' + head + '</header>' +
      '<div class="ev-body"><div class="ev-fact"><div class="ev-lab">' + esc(COLS.f) + '</div>' + (fv !== null ? fv : '<p>' + esc(f.f) + '</p>') + '</div>' +
      '<div class="ev-mean' + (o.meanCls ? ' ' + o.meanCls : '') + '"><div class="ev-lab">' + esc(COLS.b) + '</div>' + (bv !== null ? bv : '<p>' + esc(f.b) + '</p>') + '</div></div></article>';
  }

  /* Liste */
  var lst = { view: pref('liste-ansicht', 'zeit'), side: 'alle', cover: false };
  function pref(k, d) { try { return localStorage.getItem(k) || d; } catch (e) { return d; } }
  function setPref(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ohne Speicher */ } }
  function phaseOf(i) {
    var p = 0;
    META.phasen.forEach(function (ph, j) { if (i >= ph[0]) p = j; });
    return p;
  }
  function liste() {
    var views = [['zeit', 'Zeitstrahl'], ['tabelle', 'Tabelle']].map(function (v) {
      return '<button class="chip" data-v="' + v[0] + '" aria-pressed="' + (lst.view === v[0]) + '">' + v[1] + '</button>';
    }).join('');
    var bar = '<div class="list-bar"><div class="group"><span class="group-lab">Ansicht</span>' + views + '</div>';
    if (lst.view === 'zeit') {
      var sides = ['alle', 'alli', 'west', 'ost', 'beide'].map(function (k) {
        return '<button class="chip side-chip s-' + k + '" data-s="' + k + '" aria-pressed="' + (lst.side === k) + '">' +
          (k === 'alle' ? 'Alle' : '<i class="dot" aria-hidden="true"></i>' + SEITE[k]) + '</button>';
      }).join('');
      bar += '<div class="group"><span class="group-lab">Handelnde</span>' + sides + '</div>' +
        '<div class="group"><button class="chip" id="cover" aria-pressed="' + lst.cover + '">Bedeutung verdecken</button></div>';
    }
    bar += '</div>';
    var head = '<h1 class="list-title">' + esc(META.title) + '</h1><p class="list-intro">' + esc(META.intro) + '</p>';
    view.innerHTML = head + bar + (lst.view === 'zeit' ? timeline() : table());
    on('.list-bar [data-v]', function (n) { lst.view = n.dataset.v; setPref('liste-ansicht', lst.view); keepScroll(liste); });
    on('.side-chip', function (n) { lst.side = n.dataset.s; keepScroll(liste); });
    on('#cover', function () { lst.cover = !lst.cover; keepScroll(liste); });
    on('.phase-link', function (n) {
      var t = document.getElementById('phase-' + n.dataset.p);
      if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    on('.ev-reveal', function (n) { n.parentNode.classList.add('open'); n.parentNode.removeChild(n); });
  }
  function keepScroll(fn) { var y = window.scrollY; fn(); window.scrollTo(0, y); }
  function table() {
    var rows = F.map(function (f) {
      return '<tr><td data-l="' + esc(COLS.z) + '">' + esc(f.z) + '</td><td data-l="' + esc(COLS.f) + '">' + esc(f.f) + '</td><td data-l="' + esc(COLS.b) + '">' + esc(f.b) + '</td></tr>';
    }).join('');
    return '<table class="facts"><thead><tr><th>' + esc(COLS.z) + '</th><th>' + esc(COLS.f) + '</th><th>' + esc(COLS.b) + '</th></tr></thead><tbody>' + rows + '</tbody></table>';
  }
  function timeline() {
    var groups = META.phasen.map(function () { return []; });
    F.forEach(function (f, i) { if (lst.side === 'alle' || f.a === lst.side) groups[phaseOf(i)].push(i); });
    var overview = '<nav class="phases" aria-label="Phasen">' + META.phasen.map(function (ph, j) {
      return '<button class="phase-link" data-p="' + j + '"' + (groups[j].length ? '' : ' disabled') + '>' +
        '<span class="phase-num">Phase ' + (j + 1) + '</span><span class="phase-span">' + esc(ph[1]) + '</span>' +
        '<span class="phase-name">' + esc(ph[2]) + '</span><span class="phase-count">' + groups[j].length + ' Ereignisse</span></button>';
    }).join('') + '</nav>';
    var lastYear = 0;
    var body = groups.map(function (ids, j) {
      if (!ids.length) return '';
      var ph = META.phasen[j];
      lastYear = 0;
      return '<section class="phase" id="phase-' + j + '"><header class="phase-head"><span class="phase-num">Phase ' + (j + 1) + ' · ' + esc(ph[1]) + '</span>' +
        '<h2 class="phase-title">' + esc(ph[2]) + '</h2></header><ol class="tl">' + ids.map(function (i) {
          var f = F[i], y = Math.floor(f.o / 10000), showYear = y !== lastYear;
          lastYear = y;
          return '<li class="ev s-' + f.a + '">' +
            '<div class="ev-year" aria-hidden="true">' + (showYear ? y : '') + '</div>' +
            '<div class="ev-rail"><span class="ev-node">' + (i + 1) + '</span></div>' +
            evCard(i, lst.cover ? {
              meanCls: 'covered',
              part: function (k) { return k === 'b' ? '<p>' + esc(f.b) + '</p><button class="ev-reveal"><span>Aufdecken</span></button>' : null; }
            } : null) + '</li>';
        }).join('') + '</ol></section>';
    }).join('');
    return overview + body;
  }

  /* Mischen */
  var mix = { deck: null, pos: 0 };
  function mischen() {
    if (!mix.deck) { mix.deck = newDeck(-1); mix.pos = 0; }
    var i = mix.deck[mix.pos];
    view.innerHTML = '<div class="bar"><span class="count">' + (mix.pos + 1) + ' / ' + F.length + '</span><span class="grow"></span>' +
      '<button class="btn btn-primary" id="next">Nächster Fakt</button></div>' +
      '<div class="progress"><i style="width:' + Math.round(100 * (mix.pos + 1) / F.length) + '%"></i></div>' +
      '<div class="stage">' + phaseLine(i) + evCard(i, { cls: 'big' }) + '</div>';
    function next() {
      var last = mix.deck[mix.pos];
      mix.pos++;
      if (mix.pos >= mix.deck.length) { mix.deck = newDeck(last); mix.pos = 0; }
      mischen();
      $('#next').focus({ preventScroll: true });
    }
    $('#next').addEventListener('click', next);
    onKey = function (e) { if (e.key === 'ArrowRight') next(); };
  }

  /* Verdecken */
  var hide = { cols: ['f', 'b'], deck: null, cur: -1, shown: {}, known: 0 };
  function hideNext() {
    if (!hide.deck || !hide.deck.length) { hide.deck = newDeck(hide.cur); hide.known = 0; }
    hide.cur = hide.deck.shift();
    hide.shown = {};
  }
  function verdecken() {
    if (hide.cur < 0) hideNext();
    var i = hide.cur, f = F[i];
    var chips = ['z', 'f', 'b'].map(function (k) {
      return '<button class="chip" data-k="' + k + '" aria-pressed="' + (hide.cols.indexOf(k) >= 0) + '">' + SHORT[k] + '</button>';
    }).join('');
    function part(k) {
      if (hide.cols.indexOf(k) < 0 || hide.shown[k]) return null;
      return ('<button class="veil veil-' + k + '" data-k="' + k + '" aria-label="' + SHORT[k] + ' aufdecken"><span class="veil-fill" aria-hidden="true">' + FILL + '</span><span class="veil-lab"><span>Aufdecken</span></span></button>');
    }
    view.innerHTML = '<div class="bar"><div class="group"><span class="group-lab">Verdeckt</span>' + chips + '</div><span class="grow"></span>' +
      '<span class="count">Noch ' + (hide.deck.length + 1) + '</span></div>' +
      '<div class="stage">' + (part('z') === null ? phaseLine(i) : '<p class="phase-line"><span class="phase-num">Zeitpunkt verdeckt</span></p>') +
      evCard(i, { cls: 'big', part: part }) + '</div>' +
      '<div class="bar" style="margin-top:24px"><button class="btn btn-secondary" id="again">Nochmal später</button><button class="btn btn-primary" id="knew">Gewusst</button></div>';
    on('.chip', function (n) {
      var k = n.dataset.k, i = hide.cols.indexOf(k);
      if (i >= 0) { if (hide.cols.length > 1) hide.cols.splice(i, 1); }
      else { hide.cols.push(k); if (hide.cols.length > 2) hide.cols.shift(); }
      hide.shown = {};
      verdecken();
    });
    on('.veil', function (n) { hide.shown[n.dataset.k] = true; verdecken(); });
    $('#knew').addEventListener('click', function () { hideNext(); verdecken(); });
    $('#again').addEventListener('click', function () {
      var c = hide.cur;
      hide.deck.splice(Math.min(3, hide.deck.length), 0, c);
      hide.cur = hide.deck.shift(); hide.shown = {};
      if (hide.cur === c && hide.deck.length) { hide.deck.push(c); hide.cur = hide.deck.shift(); }
      verdecken();
    });
    onKey = function (e) { if (e.key === 'ArrowRight') { hideNext(); verdecken(); } };
  }

  /* Ordnen */
  var ord = { size: 5, slots: null, cards: null, sel: -1, checked: false, solved: false };
  function ordNew() {
    var n = ord.size === 0 ? F.length : ord.size;
    var pick = shuffle(range(F.length)).slice(0, n).sort(function (a, b) { return F[a].o - F[b].o; });
    var cards = shuffle(pick), tries = 0;
    while (tries++ < 20 && cards.some(function (c, i) { return c === pick[i]; })) cards = shuffle(pick);
    ord.slots = pick; ord.cards = cards; ord.sel = -1; ord.checked = false; ord.solved = false;
  }
  function ordnen() {
    if (!ord.slots) ordNew();
    var sizes = [[5, '5'], [8, '8'], [12, '12'], [0, 'Alle']].map(function (s) {
      return '<button class="chip" data-s="' + s[0] + '" aria-pressed="' + (ord.size === s[0]) + '">' + s[1] + '</button>';
    }).join('');
    var right = 0;
    var rows = ord.slots.map(function (id, i) {
      var c = ord.cards[i], ok = c === id, cls = 'card', verdict = '';
      if (ok) right++;
      if (ord.checked) {
        cls += ok ? ' ok s-' + F[id].a : ' bad';
        verdict = '<span class="verdict">' + (ok ? '✓ ' + esc(F[id].n) + ' ' + tag(F[id].a) : '✗ Passt nicht zu diesem Datum') + '</span>';
      }
      if (ord.sel === i) cls += ' sel';
      return '<li class="row' + (ord.checked ? (ok ? ' row-ok s-' + F[id].a : ' row-bad') : '') + '"><div class="row-date">' + esc(F[id].d) + '</div>' +
        '<div class="ev-rail"><span class="ev-node">' + (i + 1) + '</span></div>' +
        '<button class="' + cls + '" data-i="' + i + '"' + (ord.checked && ok ? ' disabled' : '') + '>' + esc(F[c].s) + verdict + '</button></li>';
    }).join('');
    var done = ord.checked && right === ord.slots.length;
    view.innerHTML = '<div class="bar"><div class="group"><span class="group-lab">Fakten</span>' + sizes + '</div><span class="grow"></span>' +
      (ord.checked ? '<span class="count">' + right + ' von ' + ord.slots.length + ' richtig</span>' : '') + '</div>' +
      '<p class="hint">Zwei Karten nacheinander antippen, um sie zu tauschen.</p>' +
      '<ol class="rows">' + rows + '</ol>' +
      '<div class="bar" style="margin-top:24px">' +
      (done ? '<button class="btn btn-primary" id="neu">Neue Runde</button>'
        : '<button class="btn btn-secondary" id="neu">Neue Runde</button>' +
          (ord.checked ? '<button class="btn btn-secondary" id="solve">Lösung zeigen</button>' : '') +
          '<button class="btn btn-primary" id="check">Prüfen</button>') + '</div>';
    on('.chip', function (n) { ord.size = +n.dataset.s; ordNew(); ordnen(); });
    on('.card', function (n) {
      var i = +n.dataset.i;
      if (ord.sel < 0) ord.sel = i;
      else if (ord.sel === i) ord.sel = -1;
      else { var t = ord.cards[i]; ord.cards[i] = ord.cards[ord.sel]; ord.cards[ord.sel] = t; ord.sel = -1; ord.checked = false; }
      ordnen();
    });
    $('#neu').addEventListener('click', function () { ordNew(); ordnen(); });
    if ($('#check')) $('#check').addEventListener('click', function () { ord.checked = true; ord.sel = -1; ordnen(); });
    if ($('#solve')) $('#solve').addEventListener('click', function () { ord.cards = ord.slots.slice(); ord.checked = true; ord.sel = -1; ordnen(); });
    onKey = null;
  }

  /* Quiz */
  var TOPIC = { f: 'Fakt', b: 'Bedeutung', d: 'Datum' };
  var quiz = { stage: 'setup', topics: { f: true, b: true, d: true }, hard: false, len: 10, items: [], pos: 0, cur: null, score: null, wrong: [] };

  function quizStart(items) {
    if (!items) {
      items = [];
      F.forEach(function (_, i) { ['f', 'b', 'd'].forEach(function (t) { if (quiz.topics[t]) items.push({ i: i, t: t }); }); });
      items = shuffle(items);
      if (quiz.len) items = items.slice(0, quiz.len);
    }
    quiz.items = items; quiz.total = items.length; quiz.pos = 0; quiz.wrong = [];
    quiz.score = { f: [0, 0], b: [0, 0], d: [0, 0] };
    quiz.stage = 'run'; quizBuild(); quizView();
  }
  function neighbours(i) {
    var byTime = range(F.length).sort(function (a, b) { return F[a].o - F[b].o; });
    var p = byTime.indexOf(i);
    return byTime.filter(function (x) { return x !== i; }).sort(function (a, b) {
      return Math.abs(byTime.indexOf(a) - p) - Math.abs(byTime.indexOf(b) - p);
    }).slice(0, 3);
  }
  function quizBuild() {
    var it = quiz.items[quiz.pos], f = F[it.i], c = { it: it, f: f, answered: false, ok: false };
    var pool = it.t === 'f' ? f.qf : it.t === 'b' ? f.qb : f.qd;
    if (!quiz.hard) {
      c.kind = 'choice';
      c.opts = shuffle([0, 1, 2]).map(function (k) { return { text: pool[k], ok: k === 0 }; });
    } else if (it.t === 'd') {
      c.kind = 'typed';
    } else if (it.t === 'b' && Math.random() < 0.5) {
      c.kind = 'event';
      c.opts = shuffle([it.i].concat(neighbours(it.i))).map(function (k) { return { text: F[k].n, ok: k === it.i }; });
    } else {
      c.kind = 'judge';
      c.pick = Math.random() < 0.5 ? 0 : 1 + Math.floor(Math.random() * 2);
      c.opts = [{ text: 'Stimmt', ok: c.pick === 0 }, { text: 'Stimmt nicht', ok: c.pick !== 0 }];
    }
    quiz.cur = c;
  }
  function quizAnswer(ok) {
    var c = quiz.cur, t = c.it.t;
    c.answered = true; c.ok = ok;
    if (!c.it.retry) { quiz.score[t][1]++; if (ok) quiz.score[t][0]++; }
    if (!ok) {
      if (!quiz.wrong.some(function (w) { return w.i === c.it.i && w.t === t; })) quiz.wrong.push({ i: c.it.i, t: t });
      if (!c.it.retry) quiz.items.push({ i: c.it.i, t: t, retry: true });
    }
    quizView();
    var n = $('#weiter'); if (n) n.focus({ preventScroll: true });
  }
  function quizNext() {
    quiz.pos++;
    if (quiz.pos >= quiz.items.length) quiz.stage = 'result'; else quizBuild();
    quizView();
    window.scrollTo(0, 0);
  }
  function quizSetup() {
    function chips(list, key, cur) {
      return list.map(function (o) { return '<button class="chip" data-g="' + key + '" data-v="' + o[0] + '" aria-pressed="' + cur(o[0]) + '">' + o[1] + '</button>'; }).join('');
    }
    var any = quiz.topics.f || quiz.topics.b || quiz.topics.d;
    view.innerHTML = '<div class="setup">' +
      '<div class="group"><span class="group-lab">Inhalt</span>' + chips([['f', 'Fakten'], ['b', 'Bedeutung'], ['d', 'Daten']], 't', function (v) { return !!quiz.topics[v]; }) + '</div>' +
      '<div class="group"><span class="group-lab">Stufe</span>' + chips([['0', 'Normal'], ['1', 'Schwer']], 'h', function (v) { return quiz.hard === (v === '1'); }) + '</div>' +
      '<div class="group"><span class="group-lab">Fragen</span>' + chips([['10', '10'], ['25', '25'], ['0', 'Alle']], 'l', function (v) { return quiz.len === +v; }) + '</div>' +
      '<p class="hint">' + (quiz.hard
        ? 'Schwer: Aussagen einzeln als richtig oder falsch bewerten, Ereignisse aus ihrer Bedeutung erkennen, Daten selbst eintippen.'
        : 'Normal: aus drei ähnlich formulierten Antworten die zutreffende wählen.') + '</p>' +
      '<div><button class="btn btn-primary" id="start"' + (any ? '' : ' disabled') + '>Quiz starten</button></div></div>';
    on('.chip', function (n) {
      var g = n.dataset.g, v = n.dataset.v;
      if (g === 't') quiz.topics[v] = !quiz.topics[v];
      if (g === 'h') quiz.hard = v === '1';
      if (g === 'l') quiz.len = +v;
      quizSetup();
    });
    $('#start').addEventListener('click', function () { quizStart(); });
    onKey = null;
  }
  function quizRun() {
    var c = quiz.cur, f = c.f, t = c.it.t, h = '';
    var done = Math.min(quiz.pos, quiz.total);
    h += '<div class="bar"><span class="count">Frage ' + (quiz.pos + 1) + ' / ' + quiz.items.length + '</span><span class="grow"></span><button class="btn btn-text" id="quit">Beenden</button></div>';
    h += '<div class="progress"><i style="width:' + Math.round(100 * quiz.pos / quiz.items.length) + '%"></i></div>';
    h += '<div class="q"><div class="badges"><span class="badge t-' + t + '">' + TOPIC[t] + '</span>' + (quiz.hard ? '<span class="badge hard">Schwer</span>' : '') + (c.it.retry ? '<span class="badge">Wiederholung</span>' : '') + '</div>';
    var ask;
    if (c.kind === 'event') {
      ask = 'Zu welchem Ereignis gehört diese Bedeutung?';
      h += '<p class="q-ask">' + ask + '</p><p class="statement">' + esc(f.qb[0]) + '</p>';
    } else {
      if (t === 'f' && !quiz.hard) h += '<p class="q-ctx">' + esc(f.d) + '</p>';
      h += '<h1 class="q-title">' + esc(f.n) + '</h1>';
      if (c.kind === 'judge') {
        ask = t === 'f' ? 'Trifft diese Aussage zum Fakt zu?' : 'Trifft diese Aussage zur Bedeutung zu?';
        h += '<p class="q-ask">' + ask + '</p><p class="statement">' + esc((t === 'f' ? f.qf : f.qb)[c.pick]) + '</p>';
      } else if (c.kind === 'typed') {
        h += '<p class="q-ask">Wann war das? Bei Zeiträumen zählt der Beginn.</p>';
      } else {
        ask = t === 'f' ? 'Was geschah?' : t === 'b' ? 'Welche Bedeutung hatte das für die Entstehung der Teilung?' : 'Wann war das?';
        h += '<p class="q-ask">' + ask + '</p>';
      }
    }
    if (c.kind === 'typed') {
      if (!c.answered) {
        h += '<form class="typed" id="typed">' +
          (f.mon ? '<label class="field"><span>Monat</span><select class="in" id="mon"><option value="">Wählen</option>' + MONATE.map(function (m, i) { return '<option value="' + (i + 1) + '">' + m + '</option>'; }).join('') + '</select></label>' : '') +
          '<label class="field"><span>Jahr</span><input class="in" id="year" inputmode="numeric" pattern="[0-9]*" maxlength="4" placeholder="19.." autocomplete="off"></label>' +
          '<button class="btn btn-primary" type="submit">Prüfen</button></form>';
      } else {
        h += '<p class="statement">Deine Eingabe: ' + esc(c.given) + '</p>';
      }
    } else {
      h += '<div class="opts' + (c.kind === 'judge' ? ' two' : '') + '">' + c.opts.map(function (o, i) {
        var cls = 'opt', mark = String.fromCharCode(65 + i);
        if (c.answered) {
          if (o.ok) { cls += ' right'; mark = '✓'; }
          else if (c.chosen === i) { cls += ' wrong'; mark = '✗'; }
        }
        return '<button class="' + cls + '" data-i="' + i + '"' + (c.answered ? ' disabled' : '') + '><span class="k">' + mark + '</span><span>' + esc(o.text) + '</span></button>';
      }).join('') + '</div>';
    }
    if (c.answered) {
      h += '<div class="fb"><p class="fb-verdict' + (c.ok ? '' : ' no') + '">' + (c.ok ? 'Richtig' : 'Falsch') + '</p>';
      if (c.kind === 'judge' && c.pick !== 0) h += '<div class="lab">Zutreffend wäre</div><p>' + esc((t === 'f' ? f.qf : f.qb)[0]) + '</p>';
      h += '<div class="lab">Eintrag in der Liste</div>' + phaseLine(c.it.i) + evCard(c.it.i, { cls: 'focus-' + t }) + '</div>';
      h += '<button class="btn btn-primary" id="weiter">' + (quiz.pos + 1 >= quiz.items.length ? 'Auswertung' : 'Weiter') + '</button>';
    }
    h += '</div>';
    view.innerHTML = h;
    $('#quit').addEventListener('click', function () { quiz.stage = 'setup'; quizView(); });
    on('.opt', function (n) { if (c.answered) return; c.chosen = +n.dataset.i; quizAnswer(c.opts[c.chosen].ok); });
    var form = $('#typed');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var y = parseInt($('#year').value, 10), m = f.mon ? parseInt($('#mon').value, 10) : 0;
        if (!y || (f.mon && !m)) return;
        c.given = (f.mon ? MONATE[m - 1] + ' ' : '') + y;
        quizAnswer(f.y.indexOf(y) >= 0 && (!f.mon || f.mon.indexOf(m) >= 0));
      });
      (f.mon ? $('#mon') : $('#year')).focus({ preventScroll: true });
    }
    if ($('#weiter')) $('#weiter').addEventListener('click', quizNext);
    onKey = function (e) {
      if (c.answered || c.kind === 'typed') return;
      var i = '123456'.indexOf(e.key); if (i < 0) i = 'abcdef'.indexOf(e.key.toLowerCase());
      if (i >= 0 && i < c.opts.length) { c.chosen = i; quizAnswer(c.opts[i].ok); }
    };
  }
  function quizResult() {
    var s = quiz.score, r = s.f[0] + s.b[0] + s.d[0], n = s.f[1] + s.b[1] + s.d[1];
    var rows = ['f', 'b', 'd'].filter(function (t) { return s[t][1]; }).map(function (t) {
      return '<dt>' + (t === 'f' ? 'Fakten' : t === 'b' ? 'Bedeutung' : 'Daten') + '</dt><dd>' + s[t][0] + ' / ' + s[t][1] + '</dd>';
    }).join('');
    var miss = quiz.wrong.map(function (w) { return '<li class="s-' + F[w.i].a + '"><i class="dot" aria-hidden="true"></i>' + esc(F[w.i].n) + ' (' + TOPIC[w.t] + ')</li>'; }).join('');
    view.innerHTML = '<section class="result"><p class="score">' + r + ' von ' + n + '</p><dl>' + rows + '</dl>' +
      (miss ? '<h2>Noch unsicher</h2><ul>' + miss + '</ul>' : '') +
      '<div class="bar">' + (miss ? '<button class="btn btn-primary" id="redo">Fehler wiederholen</button><button class="btn btn-on-dark" id="fresh">Neues Quiz</button>'
        : '<button class="btn btn-primary" id="fresh">Neues Quiz</button>') + '</div></section>';
    $('#fresh').addEventListener('click', function () { quiz.stage = 'setup'; quizView(); });
    if ($('#redo')) $('#redo').addEventListener('click', function () { quizStart(shuffle(quiz.wrong.slice())); });
    onKey = null;
  }
  function quizView() { ({ setup: quizSetup, run: quizRun, result: quizResult })[quiz.stage](); }

  /* Navigation */
  var ROUTES = { liste: liste, mischen: mischen, verdecken: verdecken, ordnen: ordnen, quiz: quizView };
  function route() {
    var r = location.hash.replace('#', '');
    if (!ROUTES[r]) r = 'liste';
    onKey = null;
    Array.prototype.forEach.call(document.querySelectorAll('.tab'), function (a) {
      if (a.dataset.r === r) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    closeNav();
    ROUTES[r]();
    window.scrollTo(0, 0);
  }
  var burger = document.getElementById('burger');
  function closeNav() { document.body.classList.remove('nav-open'); burger.setAttribute('aria-expanded', 'false'); }
  burger.addEventListener('click', function () {
    var open = document.body.classList.toggle('nav-open');
    burger.setAttribute('aria-expanded', String(open));
  });
  document.getElementById('tabs').addEventListener('click', closeNav);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeNav();
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var tag = e.target.tagName;
    if (tag === 'INPUT' || tag === 'SELECT') return;
    if (onKey) onKey(e);
  });
  window.addEventListener('hashchange', route);
  route();
})();
