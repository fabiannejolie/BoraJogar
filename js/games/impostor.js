const currentPlayerName = document.getElementById('current-player-name') // Mostra "Vez de [nome-do-jogador-atual]".
const instruction = document.getElementById('instruction')
const secretArea = document.getElementById('secret-area') // Contém a informação secreta.
const secretInformation = document.getElementById('secret-information') // Mostra a palavra.
let currentPlayerIndex = 0
let revealedWord = false
let secretMessages = [] // Armazena uma informação para cada jogador.
const usedWords = new Set()

function drawWord() {
  let availableWords = words.palavras.filter(word => !usedWords.has(word))
  // Cria uma nova lista contendo apenas palavras que ainda não foram usadas.

  // Quando todas as palavras já foram usadas, começa um novo ciclo.
  if (availableWords.length === 0) {
    usedWords.clear()
    availableWords = [...words.palavras]
  }

  const selectedIndex = Math.floor(Math.random() * availableWords.length)
  const selectedWord = availableWords[selectedIndex]
  usedWords.add(selectedWord)

  return selectedWord
}

function playImpostor() {
  const impostorIndexes = new Set()
  const currentWord = drawWord()
  gameState.currentGame.word = currentWord
  gameState.currentGame.winners = []
  gameState.currentGame.eliminatedPlayerIndexes = []

  // Continua sorteando jogadores até atingir a quantidade configurada. Se o mesmo índice for sorteado novamente, o Set não aumenta de tamanho. O loop continua até encontrar outro jogador.
  while (impostorIndexes.size < gameState.currentGame.impostorCount) {
    impostorIndexes.add(Math.floor(Math.random() * gameState.players.length))
  }
  gameState.currentGame.impostorIndexes = [...impostorIndexes]

  secretMessages = gameState.players.map(
    (
      _,
      index // O _ representa o jogador atual, mas não é preciso usar o objeto inteiro, apenas o índice.
    ) =>
      // Se o índice do jogador estiver no Set de impostor ele recebe "Você é o IMPOSTOR!" se não, ele recebe "Sua palavra é [palavra]".
      impostorIndexes.has(index)
        ? 'Você é o IMPOSTOR!'
        : `Sua palavra é ${currentWord}`
  )
  currentPlayerIndex = 0
  revealedWord = false
  // Garante que toda nova partida comece pelo primeiro jogador e com a palavra escondida.

  showScreen(distributionPanel)
  distributionPanelUpdate()
}
