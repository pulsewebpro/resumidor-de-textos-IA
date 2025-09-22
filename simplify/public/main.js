function buildPrompt({ text, langTarget, culturalize, chips }) {
  let sys = `Eres un asistente de escritura y traducción conciso y claro. Cuando se solicite, adaptas culturalmente ejemplos y tono.`;
  const instructions = [];

  if (langTarget && langTarget !== 'auto') {
    instructions.push(`Responde en ${langTarget.toUpperCase()}.`);
  }

  if (culturalize) {
    instructions.push('Adapta el contenido al contexto cultural indicado por el usuario.');
  }

  if (chips && chips.length) {
    const grouped = chips.reduce((acc, chip) => {
      const key = chip.family || 'general';
      acc[key] = acc[key] || [];
      acc[key].push(chip.value || chip.option || chip.label || '');
      return acc;
    }, {});

    Object.entries(grouped).forEach(([family, values]) => {
      const list = values.filter(Boolean).join(', ');
      if (list) {
        instructions.push(`Preferencias para ${family}: ${list}.`);
      }
    });
  }

  const guard = `INSTRUCCIONES DE FORMATO (OBLIGATORIAS):
Devuelve ÚNICAMENTE JSON VÁLIDO con este esquema exacto:
{ "ok": true, "outputs": [{ "label": "Nombre Pestaña", "content": "texto" }] }
• Sin texto adicional, sin Markdown, sin bloques \`\`\`.
• Si hay varias salidas (p. ej. 'Bullets' y 'Tweet'), devuelve múltiples elementos en "outputs".`;

  return [
    { role: 'system', content: sys },
    { role: 'user', content: instructions.join('\n') },
    { role: 'user', content: `TEXTO DE USUARIO:\n${text}` },
    { role: 'user', content: guard },
  ];
}

function getActiveChips() {
  return Array.from(document.querySelectorAll('.chip[aria-pressed="true"]')).map((chip) => ({
    family: chip.dataset.family,
    option: chip.dataset.option,
    value: chip.dataset.value,
    label: chip.textContent.trim(),
  }));
}

function toggleChip(btn) {
  const nextState = btn.getAttribute('aria-pressed') !== 'true';
  btn.setAttribute('aria-pressed', nextState ? 'true' : 'false');
  btn.classList.toggle('chip--active', nextState);
}

function initChips() {
  const chips = document.querySelectorAll('.chip');
  chips.forEach((chip) => {
    if (chip.tagName !== 'BUTTON') {
      chip.setAttribute('role', 'button');
      if (!chip.hasAttribute('tabindex')) {
        chip.tabIndex = 0;
      }
    } else {
      chip.type = 'button';
    }
    if (!chip.hasAttribute('aria-pressed')) {
      chip.setAttribute('aria-pressed', 'false');
    }
    chip.addEventListener('click', () => toggleChip(chip));
    chip.addEventListener('keydown', (event) => {
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();
        toggleChip(chip);
      }
    });
  });
}

function activateTabByIndex(tabs, panels, index) {
  tabs.forEach((tab, idx) => {
    const selected = idx === index;
    tab.setAttribute('aria-selected', selected ? 'true' : 'false');
    tab.tabIndex = selected ? 0 : -1;
    if (selected) {
      tab.focus();
    }
  });

  panels.forEach((panel, idx) => {
    const show = idx === index;
    panel.hidden = !show;
  });
}

function bindTabKeyboardNavigation(tabList, tabs, panels) {
  tabList.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) {
      return;
    }
    event.preventDefault();
    const currentIndex = tabs.findIndex((tab) => tab.getAttribute('aria-selected') === 'true');
    if (currentIndex === -1) {
      return;
    }
    const delta = event.key === 'ArrowLeft' ? -1 : 1;
    const nextIndex = (currentIndex + delta + tabs.length) % tabs.length;
    activateTabByIndex(tabs, panels, nextIndex);
  });
}

function getTabListElement() {
  let tabList = document.querySelector('[role="tablist"]');
  if (!tabList) {
    tabList = document.querySelector('[data-tablist]');
    if (tabList) {
      tabList.setAttribute('role', 'tablist');
    }
  }
  return tabList;
}

function getPanelsContainer() {
  let container = document.querySelector('#tab-panels');
  if (!container) {
    container = document.querySelector('[data-tabpanels]');
    if (container && !container.hasAttribute('role')) {
      container.setAttribute('role', 'presentation');
    }
  }
  return container;
}

function renderOutputs(outputs) {
  const tabList = getTabListElement();
  const panelsContainer = getPanelsContainer();

  if (!tabList || !panelsContainer) {
    return;
  }

  tabList.innerHTML = '';
  panelsContainer.innerHTML = '';

  if (!outputs || !outputs.length) {
    const empty = document.createElement('p');
    empty.textContent = 'No se recibieron resultados.';
    panelsContainer.appendChild(empty);
    return;
  }

  const tabs = [];
  const panels = [];

  outputs.forEach((output, index) => {
    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = 'tab';
    tab.id = `tab-${index}`;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
    tab.tabIndex = index === 0 ? 0 : -1;
    tab.textContent = output.label || `Pestaña ${index + 1}`;
    tab.setAttribute('aria-controls', `panel-${index}`);

    const panel = document.createElement('div');
    panel.id = `panel-${index}`;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tab.id);
    panel.hidden = index !== 0;
    panel.innerHTML = '';

    const content = document.createElement('div');
    content.className = 'tab-content';
    content.textContent = output.content || '';
    panel.appendChild(content);

    tab.addEventListener('click', () => activateTabByIndex(tabs, panels, index));

    tabList.appendChild(tab);
    panelsContainer.appendChild(panel);

    tabs.push(tab);
    panels.push(panel);
  });

  bindTabKeyboardNavigation(tabList, tabs, panels);
}

function showToast(message, type = 'error') {
  const toast = document.querySelector('[data-toast]');
  if (!toast) return;
  toast.textContent = message;
  toast.dataset.state = type;
  toast.removeAttribute('hidden');
  setTimeout(() => {
    toast.setAttribute('hidden', '');
  }, 4000);
}

async function onGenerate(event) {
  if (event) {
    event.preventDefault();
  }
  const btn = document.querySelector('#btn-generate');
  const spinner = document.querySelector('#spinner');
  const textArea = document.querySelector('#input-text');
  const langSelect = document.querySelector('#lang-target');
  const culturalizeToggle = document.querySelector('#toggle-culturalize');

  if (!btn || !textArea) {
    return;
  }

  try {
    btn.disabled = true;
    if (spinner) spinner.hidden = false;

    const text = textArea.value.trim();
    if (!text) {
      showToast('Por favor escribe un texto para procesar.');
      return;
    }

    const payload = {
      prompt: buildPrompt({
        text,
        langTarget: langSelect ? langSelect.value : 'es',
        culturalize: culturalizeToggle ? culturalizeToggle.checked : false,
        chips: getActiveChips(),
      }),
    };

    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok || !result.ok) {
      throw new Error(result.message || 'No se pudo obtener una respuesta.');
    }

    const outputs = result.result?.outputs || [];
    renderOutputs(outputs);
  } catch (error) {
    showToast(error.message || 'Error desconocido');
  } finally {
    if (btn) btn.disabled = false;
    if (spinner) spinner.hidden = true;
  }
}

function initGenerate() {
  const form = document.querySelector('#prompt-form');
  const btn = document.querySelector('#btn-generate');
  if (form) {
    form.addEventListener('submit', onGenerate);
  }
  if (btn) {
    btn.type = 'button';
    btn.addEventListener('click', onGenerate);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initChips();
  initGenerate();
});
