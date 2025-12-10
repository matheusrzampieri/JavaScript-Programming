(function () {
  let selectedSkin = "player.png";

  // botões principais
  const btnPlay = document.getElementById('btnPlay');
  const btnSkins = document.getElementById('btnSkins');
  const btnOptions = document.getElementById('btnOptions');

  // painéis
  const skinsPanel = document.getElementById('sb-skinsPanel');
  const optionsPanel = document.getElementById('sb-optionsPanel');
  const skinsClose = document.getElementById('sb-skinsClose');
  const optionsClose = document.getElementById('sb-optionsClose');

  // skins
  const skinButtons = document.querySelectorAll('.skin-select');
  const optMute = document.getElementById('opt-mute');
  const optFullscreen = document.getElementById('opt-fullscreen');

  // troca de skin
  skinButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      selectedSkin = btn.dataset.skin;
      document.getElementById('player').src = selectedSkin;
      skinsPanel.classList.add('hidden');
    });
  });

  // iniciar jogo
  btnPlay.addEventListener('click', () => {
    const muted = optMute.checked;

    if (window.stopGame) {
      window.stopGame();
    }

    if (window.createNewGame) {
      window.createNewGame(selectedSkin, muted);
    }
  });

  // abrir/fechar skins
  btnSkins.addEventListener('click', () => {
    skinsPanel.classList.toggle('hidden');
    optionsPanel.classList.add('hidden');
  });

  skinsClose.addEventListener('click', () => {
    skinsPanel.classList.add('hidden');
  });

  // abrir/fechar opções
  btnOptions.addEventListener('click', () => {
    optionsPanel.classList.toggle('hidden');
    skinsPanel.classList.add('hidden');
  });

  optionsClose.addEventListener('click', () => {
    optionsPanel.classList.add('hidden');
  });

  // mutar áudio
  optMute.addEventListener('change', (ev) => {
    if (window.gameInstance && window.gameInstance.audio) {
      window.gameInstance.audio.muted = ev.target.checked;
    }
  });

  // fullscreen
  optFullscreen.addEventListener('click', () => {
    const canvas = document.getElementById('canvas1');

    if (!document.fullscreenElement) {
      canvas.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen();
    }
  });

})();
