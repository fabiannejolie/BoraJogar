const decreaseImpostorButton = document.getElementById(
  'decrease-impostor-quantity'
)
const increaseImpostorButton = document.getElementById(
  'increase-impostor-quantity'
)
const decreaseTimeButton = document.getElementById('decrease-time')
const increaseTimeButton = document.getElementById('increase-time')
const impostorQuantity = document.getElementById('impostor-quantity')
const durationTime = document.getElementById('duration-time')
const startConfiguredGameButton = document.getElementById(
  'start-configured-game'
)

function updateImpostorConfiguration() {
  // Sincroniza o estado da aplicação com a tela.
  let maximumImpostors = 3

  if (gameState.players.length <= 4) {
    maximumImpostors = 1
  } else if (gameState.players.length <= 6) {
    maximumImpostors = 2
  }

  // Se a quantidade configurada ultrapassar o máximo permitido, ela é reduzida automaticamente.
  gameState.currentGame.impostorCount = Math.min(
    gameState.currentGame.impostorCount,
    maximumImpostors
  )
  impostorQuantity.textContent = gameState.currentGame.impostorCount
  durationTime.textContent = formatDuration(
    gameState.currentGame.durationSeconds
  )
}

decreaseImpostorButton.addEventListener('click', function () {
  gameState.currentGame.impostorCount = Math.max(
    1, // Impede que fique abaixo de 1, ao tentar diminuir nesse caso, continua em 1.
    gameState.currentGame.impostorCount - 1
  )
  updateImpostorConfiguration()
})

increaseImpostorButton.addEventListener('click', function () {
  gameState.currentGame.impostorCount += 1
  updateImpostorConfiguration()
})

decreaseTimeButton.addEventListener('click', function () {
  gameState.currentGame.durationSeconds = Math.max(
    30,
    gameState.currentGame.durationSeconds - 30
  )
  updateImpostorConfiguration()
})

increaseTimeButton.addEventListener('click', function () {
  gameState.currentGame.durationSeconds += 30
  updateImpostorConfiguration()
})

startConfiguredGameButton.addEventListener('click', playImpostor)
