(function () {
  /** @type {Battle | null} */
  let battle = null;
  let muted = false;
  let importControlsMoved = false;

  const statusEl = document.getElementById('status');
  const sourceUrlEl = document.getElementById('sourceUrl');
  const spriteBaseUrlEl = document.getElementById('spriteBaseUrl');
  const fileInputEl = document.getElementById('fileInput');
  const logInputEl = document.getElementById('logInput');
  const importPanelEl = document.getElementById('importPanel');
  const importContentEl = document.getElementById('importControlsContent');
  const importModalEl = document.getElementById('importModal');
  const importModalMountEl = document.getElementById('importModalMount');
  const battleLogFullEl = document.getElementById('battleLogFull');
  const wrapperEl = document.querySelector('.wrapper');
  const mobileSideLogToggleEl = document.getElementById('mobileSideLogToggle');
  const DEFAULT_SPRITE_BASE = 'https://raw.githubusercontent.com/jrodparker-dev/pokemon-sprites/main/';

  function setStatus(message) {
    statusEl.textContent = message;
  }

  function setMobileSideLogState(isOpen) {
    if (!wrapperEl || !mobileSideLogToggleEl) return;
    wrapperEl.classList.toggle('side-log-open', isOpen);
    mobileSideLogToggleEl.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    mobileSideLogToggleEl.textContent = isOpen ? 'Hide side battle log' : 'Show side battle log';
  }

  function parseReplayPayload(text) {
    const trimmed = text.trim();
    if (!trimmed) throw new Error('Replay payload was empty.');

    if (trimmed.startsWith('{')) {
      const parsed = JSON.parse(trimmed);
      if (parsed && typeof parsed.log === 'string') {
        return {log: parsed.log, htmlLog: ''};
      }
      throw new Error('JSON replay is missing a `log` field.');
    }

    if (trimmed.startsWith('<')) {
      let htmlLog = '';
      const htmlBattleLogMatch = trimmed.match(/<div[^>]*class=["'][^"']*battle-log[^"']*["'][^>]*>([\s\S]*?)<\/div>/i);
      if (htmlBattleLogMatch && htmlBattleLogMatch[1]) htmlLog = htmlBattleLogMatch[1];
      const htmlBattleLogDataMatch = trimmed.match(/<script[^>]*class=["'][^"']*battle-log-data[^"']*["'][^>]*>([\s\S]*?)<\/script>/i);
      if (htmlBattleLogDataMatch && htmlBattleLogDataMatch[1]) {
        return {log: htmlBattleLogDataMatch[1], htmlLog: htmlLog};
      }
      const htmlTextareaMatch = trimmed.match(/<textarea[^>]*>([\s\S]*?)<\/textarea>/i);
      if (htmlTextareaMatch && htmlTextareaMatch[1]) {
        return {log: htmlTextareaMatch[1], htmlLog: htmlLog};
      }
      throw new Error('HTML replay payload was missing a battle log block.');
    }

    return {log: text, htmlLog: ''};
  }

  function renderFullBattleLog(htmlLog, logText) {
    if (!battleLogFullEl) return;
    if (htmlLog && htmlLog.trim()) {
      battleLogFullEl.innerHTML = htmlLog;
      battleLogFullEl.classList.remove('hidden');
      return;
    }
    if (logText && logText.trim()) {
      const preEl = document.createElement('pre');
      preEl.textContent = sanitizeControlChars(logText);
      battleLogFullEl.innerHTML = '';
      battleLogFullEl.appendChild(preEl);
      battleLogFullEl.classList.remove('hidden');
      return;
    }
    battleLogFullEl.innerHTML = '';
    battleLogFullEl.classList.add('hidden');
  }

  function sanitizeControlChars(value) {
    return String(value || '').replace(/[\u0000-\u001f\u007f]/g, '');
  }

  function installTypeIconGuardrails() {
    if (!window.Dex || typeof Dex.getTypeIcon !== 'function' || Dex.__typeIconGuardrailsInstalled) return;
    const originalGetTypeIcon = Dex.getTypeIcon.bind(Dex);
    Dex.getTypeIcon = function (type, isInaccessible) {
      const cleanedType = sanitizeControlChars(type).trim();
      return originalGetTypeIcon(cleanedType, isInaccessible);
    };
    Dex.__typeIconGuardrailsInstalled = true;
  }

  function normalizeSpriteBase(url) {
    const trimmed = (url || '').trim();
    if (!trimmed) return '';
    return trimmed.endsWith('/') ? trimmed : (trimmed + '/');
  }

  function applySpriteBase(url) {
    const normalized = normalizeSpriteBase(url);
    if (!normalized) return false;
    if (!window.Dex) {
      setStatus('Dex is not loaded yet, cannot apply sprite base.');
      return false;
    }
    Dex.resourcePrefix = normalized;
    Dex.fxPrefix = normalized + 'fx/';
    spriteBaseUrlEl.value = normalized;
    setStatus('Custom sprite base applied: ' + normalized);
    return true;
  }

  function updateControls() {
    if (!battle) return;
    const controls = document.querySelector('.replay-controls');
    const resetDisabled = battle.started ? '' : ' disabled';
    controls.innerHTML = battle.paused
      ? '<button data-action="play"><i class="fa fa-play"></i> Play</button>' +
        '<button data-action="reset"' + resetDisabled + '><i class="fa fa-undo"></i> Reset</button>' +
        '<button data-action="rewind"><i class="fa fa-step-backward"></i> Last turn</button>' +
        '<button data-action="ff"><i class="fa fa-step-forward"></i> Next turn</button>' +
        '<button data-action="ffto"><i class="fa fa-fast-forward"></i> Go to turn...</button>' +
        '<button data-action="switchViewpoint"><i class="fa fa-random"></i> Switch sides</button>'
      : '<button data-action="pause"><i class="fa fa-pause"></i> Pause</button>' +
        '<button data-action="reset"><i class="fa fa-undo"></i> Reset</button>' +
        '<button data-action="rewind"><i class="fa fa-step-backward"></i> Last turn</button>' +
        '<button data-action="ff"><i class="fa fa-step-forward"></i> Next turn</button>' +
        '<button data-action="ffto"><i class="fa fa-fast-forward"></i> Go to turn...</button>' +
        '<button data-action="switchViewpoint"><i class="fa fa-random"></i> Switch sides</button>';
  }

  function initSecondaryControls() {
    const controls2 = document.querySelector('.replay-controls-2');
    controls2.innerHTML =
      '<div class="chooser leftchooser speedchooser"> <em>Speed:</em> <div>' +
      '<button value="hyperfast">Hyperfast</button><button value="fast">Fast</button>' +
      '<button value="normal" class="sel">Normal</button><button value="slow">Slow</button>' +
      '<button value="reallyslow">Really Slow</button></div> </div>' +
      '<div class="chooser colorchooser"> <em>Color scheme:</em> <div>' +
      '<button class="sel" value="light">Light</button><button value="dark">Dark</button></div> </div>' +
      '<div class="chooser soundchooser"> <em>Music:</em> <div>' +
      '<button class="sel" value="on">On</button><button value="off">Off</button></div> </div>' +
      '<div class="chooser importchooser"> <em>Import:</em> <div>' +
      '<button id="settingsToggle" class="settings-toggle hidden" value="settings"><i class="fa fa-cog"></i> Settings</button></div> </div>';
  }

  function revealSettingsToggle() {
    const settingsToggle = document.getElementById('settingsToggle');
    if (settingsToggle) settingsToggle.classList.remove('hidden');
  }

  function moveImportControlsIntoSettings() {
    if (importControlsMoved) return;
    importModalMountEl.appendChild(importContentEl);
    importPanelEl.classList.add('import-panel-hidden');
    importControlsMoved = true;
    revealSettingsToggle();
  }

  function openImportModal() {
    importModalEl.classList.remove('hidden');
  }

  function closeImportModal() {
    importModalEl.classList.add('hidden');
  }

  function changeSetting(type, value, buttonEl) {
    const chooser = buttonEl.closest('.chooser');
    chooser.querySelectorAll('button').forEach(btn => btn.classList.remove('sel'));
    buttonEl.classList.add('sel');

    if (!battle) return;

    if (type === 'color') {
      document.body.classList.toggle('dark', value === 'dark');
      return;
    }

    if (type === 'sound') {
      muted = (value === 'off');
      battle.setMute(muted);
      return;
    }

    if (type === 'speed') {
      const fadeTable = {hyperfast: 40, fast: 50, normal: 300, slow: 500, reallyslow: 1000};
      const delayTable = {hyperfast: 1, fast: 1, normal: 1, slow: 1000, reallyslow: 3000};
      battle.messageShownTime = delayTable[value] || 1;
      battle.messageFadeTime = fadeTable[value] || 300;
      battle.scene.updateAcceleration();
    }
  }

  function mountBattle(payload, id) {
    if (battle) battle.destroy();
    if (!wrapperEl) throw new Error('Replay wrapper element was not found.');
    const logText = payload && typeof payload.log === 'string' ? payload.log : '';
    const htmlLog = payload && typeof payload.htmlLog === 'string' ? payload.htmlLog : '';

    const normalizedLog = logText
      .replace(/\\\//g, '/')
      .replace(/\r\n?/g, '\n');
    const cleanedLines = normalizedLog
      .split('\n')
      .map(line => sanitizeControlChars(line));

    battle = new Battle({
      id: id || 'custom-replay',
      $frame: $(wrapperEl).find('.battle'),
      $logFrame: $(wrapperEl).find('.battle-log'),
      log: cleanedLines,
      isReplay: true,
      paused: true,
      autoresize: false,
    });

    battle.subscribe(function (state) {
      if (state === 'error') {
        setStatus('Replay parsed with errors. This usually means malformed or custom log format.');
      }
      updateControls();
    });

    moveImportControlsIntoSettings();
    closeImportModal();
    updateControls();
    setMobileSideLogState(false);
    renderFullBattleLog(htmlLog, logText);
    setStatus('Replay loaded successfully.');
  }

  async function loadFromUrl(url) {
    if (!url) return;
    setStatus('Loading replay...');
    const response = await fetch(url);
    if (!response.ok) throw new Error('HTTP ' + response.status + ' while loading replay URL.');
    const payload = await response.text();
    const logPayload = parseReplayPayload(payload);
    mountBattle(logPayload, url.split('/').pop() || 'url-replay');
  }

  function bindEvents() {
    document.getElementById('loadUrl').addEventListener('click', async function () {
      try {
        await loadFromUrl(sourceUrlEl.value.trim());
      } catch (err) {
        setStatus('Could not load URL replay: ' + err.message + ' (CORS may block cross-origin URLs).');
      }
    });

    document.getElementById('applySprites').addEventListener('click', function () {
      if (!applySpriteBase(spriteBaseUrlEl.value)) {
        setStatus('Please provide a valid sprite base URL.');
      }
    });

    document.getElementById('loadText').addEventListener('click', function () {
      try {
        mountBattle(parseReplayPayload(logInputEl.value), 'pasted-replay');
      } catch (err) {
        setStatus('Could not parse pasted replay: ' + err.message);
      }
    });

    fileInputEl.addEventListener('change', function (event) {
      const file = event.target.files && event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function () {
        try {
          mountBattle(parseReplayPayload(String(reader.result || '')), file.name);
        } catch (err) {
          setStatus('Could not parse file replay: ' + err.message);
        }
      };
      reader.readAsText(file);
    });

    if (!wrapperEl) return;
    wrapperEl.addEventListener('click', function (event) {
      const target = event.target.closest('button');
      if (!target || !battle) return;
      const action = target.dataset.action;
      if (action === 'play') battle.play();
      else if (action === 'pause') battle.pause();
      else if (action === 'reset') battle.reset();
      else if (action === 'ff') battle.seekBy(1);
      else if (action === 'rewind') battle.seekBy(-1);
      else if (action === 'switchViewpoint') battle.switchViewpoint();
      else if (action === 'ffto') {
        let turn = prompt('Turn?');
        if (!turn) return;
        if (turn === 'e' || turn === 'end' || turn === 'f' || turn === 'finish') turn = 'Infinity';
        const n = Number(turn);
        if (Number.isNaN(n) || n < 0) return alert('Invalid turn');
        battle.seekTurn(n);
      }
      updateControls();
    });

    if (mobileSideLogToggleEl) {
      mobileSideLogToggleEl.addEventListener('click', function () {
        const nextState = !wrapperEl.classList.contains('side-log-open');
        setMobileSideLogState(nextState);
      });
    }

    document.addEventListener('click', function (event) {
      if (!wrapperEl || !wrapperEl.classList.contains('side-log-open')) return;
      if (window.innerWidth > 980) return;
      if (wrapperEl.contains(event.target)) return;
      setMobileSideLogState(false);
    });

    document.querySelector('.replay-controls-2').addEventListener('click', function (event) {
      const target = event.target.closest('button');
      if (!target) return;
      if (target.id === 'settingsToggle') {
        openImportModal();
        return;
      }
      const chooser = target.closest('.chooser');
      if (!chooser) return;
      if (chooser.classList.contains('colorchooser')) changeSetting('color', target.value, target);
      if (chooser.classList.contains('soundchooser')) changeSetting('sound', target.value, target);
      if (chooser.classList.contains('speedchooser')) changeSetting('speed', target.value, target);
    });

    document.getElementById('closeImportModal').addEventListener('click', function () {
      closeImportModal();
    });

    importModalEl.addEventListener('click', function (event) {
      if (event.target === importModalEl) closeImportModal();
    });
  }

  function loadFromQueryParam() {
    const params = new URLSearchParams(window.location.search);
    const source = params.get('source');
    const spriteBase = params.get('sprites') || DEFAULT_SPRITE_BASE;
    spriteBaseUrlEl.value = normalizeSpriteBase(spriteBase);
    applySpriteBase(spriteBaseUrlEl.value);
    if (!source) return;
    sourceUrlEl.value = source;
    loadFromUrl(source).catch(err => {
      setStatus('Auto-load failed: ' + err.message);
    });
  }

  initSecondaryControls();
  installTypeIconGuardrails();
  bindEvents();
  loadFromQueryParam();
  setStatus('Ready.');
})();
