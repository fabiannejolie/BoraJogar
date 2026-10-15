// Conecta os botões às funções.

const playButton = document.getElementById('play-button')
const playersNumberButton = document.getElementById('players-number')
const backButton = document.getElementById('back-button')
const confirmPlayersNumberButton = document.getElementById(
  'btn-confirm-players-number'
)
const playersNameForm = document.getElementById('players-name-form')
const revealButton = document.getElementById('reveal-button')
const nextButton = document.getElementById('next-button')
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
const timerLabel = document.getElementById('base-timer-label')
const timerProgressBar = document.getElementById('timer-progress-bar')
let timerInterval // Guarda o intervalo criado pelo setInterval.
let timeLeft = 0
const playersToVoteFor = document.getElementById('players-to-vote-for')
const votingButton = document.getElementById('voting-button')
const votingResult = document.getElementById('voting-result')
const playAgainImpostor = document.getElementById('play-again-impostor-button')
const backToTheStartImpostor = document.getElementById(
  'back-to-the-start-impostor-button'
)
let selectedPlayerIndex = null
let votingFinished = false

playButton.addEventListener('click', () => showScreen(impostor))
playersNumberButton.addEventListener('click', openAmountOfPlayers)
backButton.addEventListener('click', () => showScreen(homeScreen))
confirmPlayersNumberButton.addEventListener('click', register)
playersNameForm.addEventListener('submit', event =>
  savePlayers(event, impostor)
)
revealButton.addEventListener('click', function () {
  revealedWord = true
  distributionPanelUpdate()
  // O segredo aparece, o botão de revelar desaparece e o botão de passar aparece.
})

nextButton.addEventListener('click', function () {
  // O segredo deixa de aparecer
  revealedWord = false
  secretInformation.textContent = ''

  // Se for o último jogador, encerra a distribuição
  if (currentPlayerIndex === gameState.players.length - 1) {
    currentPlayerIndex = 0
    revealedWord = false
    showScreen(votingScreen)
    renderVotingPlayers()
    startTimer()
    return
  }

  // Avança para o próximo jogador.
  currentPlayerIndex++

  distributionPanelUpdate()
})

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
  const maximumImpostors = Math.max(1, gameState.players.length - 1)

  gameState.currentGame.impostorCount = Math.min(
    maximumImpostors,
    gameState.currentGame.impostorCount + 1
  )
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

function renderVotingPlayers() {
  playersToVoteFor.innerHTML = ''
  selectedPlayerIndex = null
  votingFinished = false
  votingButton.disabled = true
  votingResult.textContent = ''
  playAgainImpostor.style.display = 'none'
  backToTheStartImpostor.style.display = 'none'

  gameState.players.forEach((player, index) => {
    const playerButton = document.createElement('button')
    playerButton.type = 'button'
    playerButton.textContent = player.name.toUpperCase()
    playerButton.setAttribute('aria-pressed', 'false')
    playerButton.disabled =
      gameState.currentGame.eliminatedPlayerIndexes.includes(index)

    playerButton.addEventListener('click', () => {
      if (
        votingFinished ||
        gameState.currentGame.eliminatedPlayerIndexes.includes(index)
      ) {
        return
      }

      selectedPlayerIndex = index

      // Garante que apenas um jogador fique selecionado.
      playersToVoteFor.querySelectorAll('button').forEach(button => {
        button.classList.remove('selected')
        button.setAttribute('aria-pressed', 'false')
      })

      playerButton.classList.add('selected')
      playerButton.setAttribute('aria-pressed', 'true')
      votingButton.disabled = false
    })

    playersToVoteFor.appendChild(playerButton)
  })
}

votingButton.addEventListener('click', () => {
  if (selectedPlayerIndex === null || votingFinished) {
    return
  }

  const votedPlayer = gameState.players[selectedPlayerIndex]
  const votedForImpostor =
    gameState.currentGame.impostorIndexes.includes(selectedPlayerIndex) // Verifica se o índice votado está dentro da lista de impostores.
  const remainingImpostors = gameState.currentGame.impostorIndexes.filter(
    index =>
      !gameState.currentGame.eliminatedPlayerIndexes.includes(index) &&
      index !== selectedPlayerIndex
  )

  clearInterval(timerInterval) // Depois do voto o timer é parado.
  votingFinished = true
  votingButton.disabled = true

  if (votedForImpostor && remainingImpostors.length > 0) {
    gameState.currentGame.eliminatedPlayerIndexes.push(selectedPlayerIndex)
    const votedPlayerButton = playersToVoteFor.querySelectorAll('button')[
      selectedPlayerIndex
    ]
    votedPlayerButton.disabled = true
    votedPlayerButton.classList.remove('selected')
    votedPlayerButton.setAttribute('aria-pressed', 'false')
    selectedPlayerIndex = null
    votingFinished = false
    votingButton.disabled = true
    votingResult.textContent = `Acertou! ${votedPlayer.name.toUpperCase()} era um impostor.
    Ainda há mais impostores para serem encontrados.`
    startTimer()
    return
  }

  const winners = votedForImpostor
    ? // Filtra todos os jogadores cujo índice não está em ImpostorIndexes, vencedores = jogadores. comuns.
      gameState.players
        .filter(
          (_, index) => !gameState.currentGame.impostorIndexes.includes(index)
        )
        .map(player => player.name) // Transforma a lista de objetos em uma lista contendo apenas seus nomes.
    : // Filtra os jogadores cujo índice está em ImpostorIndexes, vencedores = impostores.
      gameState.players
        .filter((_, index) =>
          gameState.currentGame.impostorIndexes.includes(index)
        )
        .map(player => player.name)

  gameState.currentGame.winners = winners
  gameState.matchResults.push({
    word: gameState.currentGame.word,
    winners: [...winners] // Cria uma cópia do array e evita que futuras alterações no array original winners modifiquem o resultado já salvo no histórico.
  })

  const impostorNames = gameState.currentGame.impostorIndexes
    .map(index => gameState.players[index].name.toUpperCase())
    .join(', ')

  if (votedForImpostor) {
    votingResult.textContent =
      gameState.currentGame.impostorIndexes.length === 1
        ? `Acertou! ${votedPlayer.name.toUpperCase()} era um impostor.
        A palavra era ${gameState.currentGame.word}.`
        : `Acertou! Os impostores eram: ${impostorNames}.
        A palavra era ${gameState.currentGame.word}.`
  } else {
    votingResult.textContent =
      gameState.currentGame.impostorIndexes.length === 1
        ? `Você votou em ${votedPlayer.name.toUpperCase()}. Ele(a) não era um impostor.
        O impostor era ${impostorNames}. A palavra era ${gameState.currentGame.word}.`
        : `Você votou em ${votedPlayer.name.toUpperCase()}. Ele(a) não era um impostor.
        Os impostores eram: ${impostorNames}. A palavra era ${gameState.currentGame.word}.`
  }

  playersToVoteFor.querySelectorAll('button').forEach(button => {
    button.disabled = true
  })
  playAgainImpostor.style.display = 'block'
  backToTheStartImpostor.style.display = 'block'
})

playAgainImpostor.addEventListener('click', () => {
  showScreen(configImpostorScreen)
})

backToTheStartImpostor.addEventListener('click', () => {
  showScreen(homeScreen)
})
