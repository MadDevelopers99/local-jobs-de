// LocalJobs.de — shared interactions
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- mobile hamburger nav ---------- */
  const hamburger = document.querySelector('.hamburger');
  const mainNav = document.querySelector('.main-nav');
  if (hamburger && mainNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('mobile-open');
      mainNav.style.cssText = isOpen
        ? 'display:flex;flex-direction:column;position:absolute;top:68px;left:0;right:0;background:#fff;padding:16px 24px;border-bottom:1px solid var(--border);gap:14px;z-index:80;'
        : '';
    });
  }

  /* ---------- generic modal open/close ---------- */
  document.querySelectorAll('[data-open-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = document.getElementById(btn.getAttribute('data-open-modal'));
      if (modal) modal.classList.add('open');
    });
  });
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.modal-overlay')?.classList.remove('open');
    });
  });
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) overlay.classList.remove('open');
    });
  });

  /* ---------- tabs ---------- */
  document.querySelectorAll('[data-tabs]').forEach(group => {
    const buttons = group.querySelectorAll('.tabs button');
    const panels = group.parentElement.querySelectorAll('.tab-panel');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab)?.classList.add('active');
        if (window.ljRefreshMaps) setTimeout(window.ljRefreshMaps, 60);
      });
    });
  });

  /* ---------- jump to a tab from elsewhere on the page ---------- */
  document.querySelectorAll('[data-goto-tab]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const btn = document.querySelector('.tabs button[data-tab="' + link.dataset.gotoTab + '"]');
      btn?.click();
      btn?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  });

  /* ---------- apply options selection ---------- */
  document.querySelectorAll('.apply-option[data-select]').forEach(opt => {
    opt.addEventListener('click', () => {
      const href = opt.getAttribute('data-href');
      if (href) window.location.href = href;
    });
  });

  /* ---------- save / bookmark toggle ---------- */
  document.querySelectorAll('.save-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      btn.classList.toggle('saved');
    });
  });

  /* ---------- toggle switches (alerts) ---------- */
  document.querySelectorAll('.toggle').forEach(t => {
    t.addEventListener('click', () => t.classList.toggle('on'));
  });

  /* ---------- form stepper (multi-step apply form) ---------- */
  const steps = document.querySelectorAll('.form-step');
  if (steps.length) {
    let current = 0;
    const stepperItems = document.querySelectorAll('.stepper .step');
    const stepperLines = document.querySelectorAll('.stepper .line');
    const caption = document.querySelector('.stepper-caption');

    function render() {
      steps.forEach((s, i) => s.style.display = i === current ? 'block' : 'none');
      stepperItems.forEach((s, i) => {
        s.classList.remove('current', 'done');
        if (i < current) s.classList.add('done');
        else if (i === current) s.classList.add('current');
      });
      stepperLines.forEach((l, i) => l.classList.toggle('done', i < current));
      if (caption && stepperItems[current]) {
        const label = stepperItems[current].querySelector('.label')?.textContent || '';
        caption.textContent = `Schritt ${current + 1} von ${stepperItems.length} — ${label}`;
      }
    }

    document.querySelectorAll('[data-next-step]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (current < steps.length - 1) { current++; render(); window.scrollTo({top:0,behavior:'smooth'}); }
      });
    });
    document.querySelectorAll('[data-prev-step]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (current > 0) { current--; render(); window.scrollTo({top:0,behavior:'smooth'}); }
      });
    });
    render();
  }

  /* ---------- chat: switch conversation + send message ---------- */
  const chatItems = document.querySelectorAll('.chat-item[data-chat]');
  chatItems.forEach(item => {
    item.addEventListener('click', () => {
      chatItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      const nameEl = document.querySelector('.chat-window-head .txt strong, .chat-window-head strong');
      if (nameEl) nameEl.textContent = item.querySelector('.txt strong').textContent;
      if (window.innerWidth <= 860) {
        document.querySelector('.chat-list')?.style.setProperty('display', 'none');
        document.querySelector('.chat-window')?.style.setProperty('display', 'flex');
      }
    });
  });
  const chatBack = document.querySelector('[data-chat-back]');
  if (chatBack) {
    chatBack.addEventListener('click', () => {
      document.querySelector('.chat-list')?.style.setProperty('display', 'block');
      document.querySelector('.chat-window')?.style.setProperty('display', 'none');
    });
  }

  const chatForm = document.querySelector('.chat-input');
  if (chatForm) {
    const input = chatForm.querySelector('input');
    const sendBtn = chatForm.querySelector('.send');
    const messages = document.querySelector('.chat-messages');
    function send() {
      const val = input.value.trim();
      if (!val || !messages) return;
      const msg = document.createElement('div');
      msg.className = 'msg out';
      msg.innerHTML = val + '<div class="msg-time">Jetzt</div>';
      messages.appendChild(msg);
      messages.scrollTop = messages.scrollHeight;
      input.value = '';
    }
    sendBtn?.addEventListener('click', send);
    input?.addEventListener('keydown', e => { if (e.key === 'Enter') send(); });
  }

  /* ---------- map pin popup toggle ---------- */
  document.querySelectorAll('.map-pin').forEach(pin => {
    pin.addEventListener('click', (e) => {
      e.stopPropagation();
      const wasOpen = pin.classList.contains('open');
      document.querySelectorAll('.map-pin.open').forEach(p => p.classList.remove('open'));
      if (!wasOpen) pin.classList.add('open');
    });
  });
  document.addEventListener('click', () => {
    document.querySelectorAll('.map-pin.open').forEach(p => p.classList.remove('open'));
  });

  /* ---------- list / map view toggle ---------- */
  const viewToggleBtns = document.querySelectorAll('.view-toggle button');
  if (viewToggleBtns.length) {
    viewToggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        viewToggleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const target = btn.dataset.view;
        document.querySelectorAll('[data-view-panel]').forEach(p => {
          p.style.display = p.dataset.viewPanel === target ? '' : 'none';
        });
        if (window.ljRefreshMaps) setTimeout(window.ljRefreshMaps, 60);
      });
    });
  }

  /* ---------- range slider fill (distance filter) ---------- */
  document.querySelectorAll('input[type=range]').forEach(range => {
    const out = document.querySelector(range.dataset.output ? '#' + range.dataset.output : null);
    if (out) {
      const update = () => out.textContent = range.value + ' km';
      range.addEventListener('input', update);
      update();
    }
  });

});
