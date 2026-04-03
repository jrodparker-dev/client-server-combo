(function () {
  /** @type {Battle | null} */
  let battle = null;
  let muted = false;

  const statusEl = document.getElementById('status');
  const sourceUrlEl = document.getElementById('sourceUrl');
  const spriteBaseUrlEl = document.getElementById('spriteBaseUrl');
  const fileInputEl = document.getElementById('fileInput');
  const logInputEl = document.getElementById('logInput');
  const DEFAULT_SPRITE_BASE = 'https://raw.githubusercontent.com/jrodparker-dev/pokemon-sprites/main/';

  function setStatus(message) {
    statusEl.textContent = message;
  }

  function parseReplayPayload(text) {
    const trimmed = text.trim();
    if (!trimmed) throw new Error('Replay payload was empty.');

    if (trimmed.startsWith('{')) {
      const parsed = JSON.parse(trimmed);
      if (parsed && typeof parsed.log === 'string') return parsed.log;
      throw new Error('JSON replay is missing a `log` field.');
    }

    return text;
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
      '<button class="sel" value="on">On</button><button value="off">Off</button></div> </div>';
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

  function mountBattle(logText, id) {
    if (battle) battle.destroy();

    const wrapper = document.querySelector('.wrapper');
    battle = new Battle({
      id: id || 'custom-replay',
      $frame: $(wrapper).find('.battle'),
      $logFrame: $(wrapper).find('.battle-log'),
      log: logText.replace(/\\\//g, '/').split('\n'),
      isReplay: true,
      paused: true,
      autoresize: true,
    });

    battle.subscribe(function (state) {
      if (state === 'error') {
        setStatus('Replay parsed with errors. This usually means malformed or custom log format.');
      }
      updateControls();
    });

    updateControls();
    setStatus('Replay loaded successfully.');
  }

  async function loadFromUrl(url) {
    if (!url) return;
    setStatus('Loading replay...');
    const response = await fetch(url);
    if (!response.ok) throw new Error('HTTP ' + response.status + ' while loading replay URL.');
    const payload = await response.text();
    const log = parseReplayPayload(payload);
    mountBattle(log, url.split('/').pop() || 'url-replay');
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

    document.querySelector('.wrapper').addEventListener('click', function (event) {
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

    document.querySelector('.replay-controls-2').addEventListener('click', function (event) {
      const target = event.target.closest('button');
      if (!target) return;
      const chooser = target.closest('.chooser');
      if (chooser.classList.contains('colorchooser')) changeSetting('color', target.value, target);
      if (chooser.classList.contains('soundchooser')) changeSetting('sound', target.value, target);
      if (chooser.classList.contains('speedchooser')) changeSetting('speed', target.value, target);
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
  bindEvents();
  loadFromQueryParam();
  setStatus('Ready.');
})();
