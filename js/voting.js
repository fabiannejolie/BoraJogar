const playersToVoteFor = document.getElementById('players-to-vote-for')
const votingButton = document.getElementById('voting-button')
const votingResult = document.getElementById('voting-result')
const playAgainImpostor = document.getElementById('play-again-impostor-button')
const backToTheStartImpostor = document.getElementById(
  'back-to-the-start-impostor-button'
)
let selectedPlayerIndex = null
let votingFinished = false

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

function decideVotingResult(selectedIndex) {
  const votedPlayer = gameState.players[selectedIndex]
  const votedForImpostor =
    gameState.currentGame.impostorIndexes.includes(selectedIndex) // Verifica se o índice votado está dentro da lista de impostores.
  const winners = votedForImpostor
    ? // Filtra todos os jogadores cujo índice não está em ImpostorIndexes, vencedores = jogadores comuns.
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

  return {
    votedPlayer,
    votedForImpostor,
    winners
  }
}

function finishMatch(result) {
  const { votedPlayer, votedForImpostor, winners } = result
  const impostorNames = gameState.currentGame.impostorIndexes
    .map(index => gameState.players[index].name.toUpperCase())
    .join(', ')

  gameState.currentGame.winners = winners
  gameState.matchResults.push({
    word: gameState.currentGame.word,
    winners: [...winners] // Cria uma cópia do array e evita que futuras alterações no array original winners modifiquem o resultado já salvo no histórico.
  })

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
}

votingButton.addEventListener('click', () => {
  if (selectedPlayerIndex === null || votingFinished) {
    return
  }

  const result = decideVotingResult(selectedPlayerIndex)
  const remainingImpostors = gameState.currentGame.impostorIndexes.filter(
    index =>
      !gameState.currentGame.eliminatedPlayerIndexes.includes(index) &&
      index !== selectedPlayerIndex
  )

  clearInterval(timerInterval) // Depois do voto o timer é parado.
  votingFinished = true
  votingButton.disabled = true

  if (result.votedForImpostor && remainingImpostors.length > 0) {
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
    votingResult.textContent = `Acertou! ${result.votedPlayer.name.toUpperCase()} era um impostor.
    Ainda há mais impostores para serem encontrados.`
    startTimer()
    return
  }

  finishMatch(result)
})

playAgainImpostor.addEventListener('click', () => {
  showScreen(configImpostorScreen)
})

backToTheStartImpostor.addEventListener('click', () => {
  showScreen(homeScreen)
})
