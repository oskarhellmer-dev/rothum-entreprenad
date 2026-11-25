// Mobile menu
const menuBtn = document.getElementById('menuBtn');
const mainNav = document.getElementById('mainNav');

if (menuBtn && mainNav) {
  menuBtn.addEventListener('click', () => {
    const open = mainNav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });

  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

// Render interactive service tabs from window.SITE_DATA
const tabsData = window.SITE_DATA?.serviceTabs || {};
const tabKeys = Object.keys(tabsData);
const routerTabs = document.getElementById('routerTabs');
const rpTitle = document.getElementById('rpTitle');
const rpBadge = document.getElementById('rpBadge');
const rpDesc = document.getElementById('rpDesc');
const rpBullets = document.getElementById('rpBullets');
const rpQuoteBtn = document.getElementById('rpQuoteBtn');

let activeTabKey = tabKeys[0] || '';

function setActiveTab(key) {
  const item = tabsData[key];
  if (!item) return;
  activeTabKey = key;

  routerTabs.querySelectorAll('.router-tab').forEach((btn) => {
    const selected = btn.dataset.key === key;
    btn.classList.toggle('is-active', selected);
    btn.setAttribute('aria-selected', String(selected));
  });

  rpTitle.textContent = item.title;
  rpBadge.textContent = item.badge;
  rpDesc.textContent = item.desc;
  rpBullets.innerHTML = item.bullets.map((b) => `<li>${b}</li>`).join('');
  if (rpQuoteBtn) {
    rpQuoteBtn.dataset.quoteOption = item.quoteOption;
  }
}

if (routerTabs && tabKeys.length > 0) {
  routerTabs.innerHTML = tabKeys
    .map((key, idx) => {
      const item = tabsData[key];
      return `<button type="button" class="router-tab${idx === 0 ? ' is-active' : ''}" role="tab" aria-selected="${idx === 0}" data-key="${key}">${item.label}</button>`;
    })
    .join('');

  routerTabs.addEventListener('click', (e) => {
    const btn = e.target.closest('.router-tab');
    if (btn) setActiveTab(btn.dataset.key);
  });

  setActiveTab(activeTabKey);
}

// Helper to pre-check a topic in the quote builder and scroll to it
function preselectTopicAndScroll(topicValue) {
  const quoteForm = document.getElementById('quoteForm');
  if (!quoteForm) return;
  const checkbox = quoteForm.querySelector(`input[name="topics"][value="${topicValue}"]`);
  if (checkbox) {
    checkbox.checked = true;
  }
  document.getElementById('offert').scrollIntoView({ behavior: 'smooth' });
  document.getElementById('qName').focus({ preventScroll: true });
}

if (rpQuoteBtn) {
  rpQuoteBtn.addEventListener('click', () => {
    preselectTopicAndScroll(rpQuoteBtn.dataset.quoteOption);
  });
}

document.querySelectorAll('[data-preset]').forEach((el) => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    preselectTopicAndScroll(el.dataset.preset);
  });
});

// Quote Builder validation + email/clipboard export
const quoteForm = document.getElementById('quoteForm');
const formError = document.getElementById('formError');
const formSuccess = document.getElementById('formSuccess');
const copyQuoteBtn = document.getElementById('copyQuoteBtn');

function collectQuotePayload() {
  const name = document.getElementById('qName').value.trim();
  const phone = document.getElementById('qPhone').value.trim();
  const email = document.getElementById('qEmail').value.trim();
  const location = document.getElementById('qLocation').value.trim();
  const deduction = document.getElementById('qDeduction').value;
  const reply = document.getElementById('qReply').value;
  const message = document.getElementById('qMessage').value.trim();
  const checked = Array.from(quoteForm.querySelectorAll('input[name="topics"]:checked')).map((el) => el.value);

  return { name, phone, email, location, deduction, reply, message, checked };
}

function formatQuoteMessage(p) {
  const topicsText = p.checked.length ? p.checked.join(', ') : 'Allmän förfrågan';
  return {
    subject: `Prisförfrågan: ${topicsText} (${p.name})`,
    body: [
      `Namn / Företag: ${p.name}`,
      `Telefon: ${p.phone}`,
      p.email ? `E-post: ${p.email}` : null,
      p.location ? `Ort / Område: ${p.location}` : null,
      `Valda tjänster: ${topicsText}`,
      `Skatteavdrag / Tillval: ${p.deduction}`,
      `Önskad kontaktväg: ${p.reply}`,
      '',
      'Beskrivning:',
      p.message,
    ]
      .filter((line) => line !== null)
      .join('\n'),
  };
}

function validatePayload(p) {
  if (!p.name || !p.phone || !p.message) {
    formSuccess.hidden = true;
    formError.textContent = 'Fyll i namn/företag, telefonnummer och en kort beskrivning så vi kan återkomma med prisförslag.';
    formError.hidden = false;
    return false;
  }
  formError.hidden = true;
  return true;
}

if (quoteForm) {
  quoteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const p = collectQuotePayload();
    if (!validatePayload(p)) return;

    const { subject, body } = formatQuoteMessage(p);
    const targetEmail = window.SITE_DATA?.company?.email || 'info@rothum.se';
    window.location.href = `mailto:${targetEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    formSuccess.textContent = `Ditt e-postprogram öppnas nu med ett färdigt mejl till ${targetEmail}. Om inget händer kan du trycka på "Kopiera färdig text" nedan.`;
    formSuccess.hidden = false;
  });
}

if (copyQuoteBtn && quoteForm) {
  copyQuoteBtn.addEventListener('click', async () => {
    const p = collectQuotePayload();
    if (!validatePayload(p)) return;

    const { subject, body } = formatQuoteMessage(p);
    const targetEmail = window.SITE_DATA?.company?.email || 'info@rothum.se';
    const fullText = `Till: ${targetEmail}\nÄmne: ${subject}\n\n${body}`;

    try {
      await navigator.clipboard.writeText(fullText);
      formSuccess.textContent = `Texten är kopierad! Klistra in i ditt mejl eller SMS till ${targetEmail} / 070-654 41 65.`;
      formSuccess.hidden = false;
    } catch {
      formError.textContent = `Kunde inte kopiera automatiskt – skicka ditt mejl direkt till ${targetEmail}.`;
      formError.hidden = false;
    }
  });
}
