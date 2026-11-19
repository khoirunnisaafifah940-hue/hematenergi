(function () {
  'use strict';

  var menu = document.querySelector('.menu');
  var nav = document.getElementById('nav');
  if (menu && nav) {
    menu.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      menu.setAttribute('aria-expanded', String(open));
    });
  }

  var hero = document.getElementById('hero');
  var lamp = document.getElementById('lamp');
  var hint = document.getElementById('hint');
  if (!hero || !lamp) return;

  lamp.addEventListener('click', function () {
    var wasLit = hero.getAttribute('data-lit') === 'true';
    hero.setAttribute('data-lit', String(!wasLit));
    lamp.setAttribute('aria-label', wasLit ? 'Nyalakan lampu' : 'Matikan lampu');
    if (hint) hint.textContent = wasLit ? 'Tarik lagi untuk menyalakan' : 'Tarik tali lampunya';
  });

  function aim(e) {
    var r = hero.getBoundingClientRect();
    hero.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    hero.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }
  hero.addEventListener('pointermove', aim);
  hero.addEventListener('pointerdown', aim);
})();

/* === FASE 2: Interaktivitas Halaman Data & Fakta === */
(function () {
  'use strict';

  var barList = document.getElementById('bar-list');
  var filterBtns = document.querySelectorAll('.filter-btn');
  if (barList && filterBtns.length) {
    var surveyData = {
      semua: [
        { label: 'Lampu kelas menyala saat istirahat', pct: 78, tone: '' },
        { label: 'Kipas angin tetap berputar di kelas kosong', pct: 72, tone: '' },
        { label: 'Charger tertancap tanpa perangkat', pct: 64, tone: 'leaf' },
        { label: 'Proyektor / layar dalam mode standby', pct: 53, tone: 'leaf' },
        { label: 'Pintu terbuka saat AC / pendingin aktif', pct: 69, tone: '' }
      ],
      kelas: [
        { label: 'Lampu kelas menyala saat istirahat', pct: 84, tone: '' },
        { label: 'Kipas angin tetap berputar di kelas kosong', pct: 79, tone: '' },
        { label: 'Charger tertancap tanpa perangkat', pct: 68, tone: 'leaf' },
        { label: 'Proyektor / layar dalam mode standby', pct: 46, tone: 'leaf' },
        { label: 'Pintu terbuka saat AC / pendingin aktif', pct: 61, tone: '' }
      ],
      lab: [
        { label: 'Lampu kelas menyala saat istirahat', pct: 62, tone: '' },
        { label: 'Kipas angin tetap berputar di kelas kosong', pct: 54, tone: '' },
        { label: 'Charger tertancap tanpa perangkat', pct: 58, tone: 'leaf' },
        { label: 'Proyektor / layar dalam mode standby', pct: 74, tone: 'leaf' },
        { label: 'Pintu terbuka saat AC / pendingin aktif', pct: 85, tone: '' }
      ]
    };

    function renderBars(key) {
      var rows = surveyData[key] || surveyData.semua;
      barList.innerHTML = rows.map(function (item) {
        return '<div class="bar-row">' +
          '<span class="bar-name">' + item.label + '</span>' +
          '<div class="bar-track" role="progressbar" aria-valuenow="' + item.pct + '" aria-valuemin="0" aria-valuemax="100">' +
            '<div class="bar-fill ' + item.tone + '" style="width:' + item.pct + '%"></div>' +
          '</div>' +
          '<span class="bar-val">' + item.pct + '%</span>' +
        '</div>';
      }).join('');
    }

    renderBars('semua');

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        renderBars(btn.getAttribute('data-filter'));
      });
    });
  }

  var deviceSel = document.getElementById('calc-device');
  var hoursRange = document.getElementById('calc-hours');
  var roomsRange = document.getElementById('calc-rooms');
  var hoursOut = document.getElementById('calc-hours-out');
  var roomsOut = document.getElementById('calc-rooms-out');
  var kwhOut = document.getElementById('calc-kwh');
  var co2Out = document.getElementById('calc-co2');

  if (deviceSel && hoursRange && roomsRange && kwhOut && co2Out) {
    function updateCalc() {
      var watt = parseFloat(deviceSel.value) || 0;
      var hours = parseFloat(hoursRange.value) || 0;
      var rooms = parseInt(roomsRange.value, 10) || 1;
      if (hoursOut) hoursOut.textContent = hours + ' jam/hari';
      if (roomsOut) roomsOut.textContent = rooms + ' ruangan';

      var monthlyKwh = (watt * hours * rooms * 20) / 1000;
      var monthlyCo2 = monthlyKwh * 0.85;

      kwhOut.textContent = monthlyKwh.toFixed(1) + ' kWh';
      co2Out.textContent = 'Setara pengurangan sekitar ' + monthlyCo2.toFixed(1) + ' kg emisi CO₂ per bulan sekolah.';
    }

    deviceSel.addEventListener('change', updateCalc);
    hoursRange.addEventListener('input', updateCalc);
    roomsRange.addEventListener('input', updateCalc);
    updateCalc();
  }
})();
