const timerLabel = document.getElementById('base-timer-label')
const timerProgressBar = document.getElementById('timer-progress-bar')
let timerInterval // Guarda o intervalo criado pelo setInterval.
let timeLeft = 0

function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0')
  const remainingSeconds = (seconds % 60).toString().padStart(2, '0')

  return `${minutes}:${remainingSeconds}`
}

function playAlarmSound() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext
  if (!AudioContextClass) {
    return
  }

  try {
    const audioCtx = new AudioContextClass()
    const beepTimes = [0, 0.2, 0.4]

    beepTimes.forEach(startTime => {
      const oscillator = audioCtx.createOscillator()
      const gainNode = audioCtx.createGain()

      oscillator.type = 'square'
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime + startTime)

      gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime + startTime)
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        audioCtx.currentTime + startTime + 0.15
      )

      oscillator.connect(gainNode)
      gainNode.connect(audioCtx.destination)

      oscillator.start(audioCtx.currentTime + startTime)
      oscillator.stop(audioCtx.currentTime + startTime + 0.15)
    })
  } catch (error) {
    // Ignora caso o navegador bloqueie reprodução de áudio sem interação prévia.
  }
}

function updateTimer() {
  timerLabel.textContent = formatDuration(timeLeft)
  const progress =
    gameState.currentGame.durationSeconds > 0
      ? timeLeft / gameState.currentGame.durationSeconds
      : 0
  timerProgressBar.style.width = `${progress * 100}%`
  timerProgressBar.classList.toggle('is-finished', timeLeft === 0)
  const voteBtn = document.getElementById('voting-button')
  if (voteBtn) {
    voteBtn.classList.toggle('time-up', timeLeft === 0)
  }
}

function startTimer() {
  clearInterval(timerInterval) // Evita que dois timers rodem ao mesmo tempo quando uma partida nova é iniciada.
  timeLeft = gameState.currentGame.durationSeconds
  updateTimer()

  timerInterval = setInterval(() => {
    timeLeft = Math.max(0, timeLeft - 1) // Impede que o timer fique negativo.
    updateTimer()

    if (timeLeft === 0) {
      clearInterval(timerInterval)
      playAlarmSound()
    }
  }, 1000)
}
