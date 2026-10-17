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

function updateTimer() {
  timerLabel.textContent = formatDuration(timeLeft)
  const progress =
    gameState.currentGame.durationSeconds > 0
      ? timeLeft / gameState.currentGame.durationSeconds
      : 0
  timerProgressBar.style.width = `${progress * 100}%`
  timerProgressBar.classList.toggle('is-finished', timeLeft === 0)
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
    }
  }, 1000)
}
