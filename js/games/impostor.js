const playersNumberButton = document.getElementById("players-number")
const startImpostorButton = document.getElementById("start-impostor-button") // Inicia o jogo
const currentPlayerName = document.getElementById("current-player-name") // Mostra "Vez de [nome-do-jogador-atual]".
const instruction = document.getElementById("instruction")
const secretArea = document.getElementById("secret-area") // Contém a informação secreta.
const secretInformation = document.getElementById("secret-information") // Mostra a palavra.
let currentPlayerIndex = 0
let revealedWord = false
let secretMessages = [] // Armazena uma informação para cada jogador.
const words = ["PRAIA", "VESTIDO", "LIXO"]
const usedWords = new Set()

function drawWord() {
    let availableWords = words.filter((word) => !usedWords.has(word))
    // Cria uma nova lista contendo apenas palavras que ainda não foram usadas.

    // Quando todas as palavras já foram usadas, começa um novo ciclo.
    if (availableWords.length === 0) {
        usedWords.clear()
        availableWords = [...words]
    }

    const selectedIndex = Math.floor(Math.random() * availableWords.length)
    const selectedWord = availableWords[selectedIndex]
    usedWords.add(selectedWord)

    return selectedWord
}

function showImpostorStartButton() {
    playersNumberButton.style.display = "none"
    startImpostorButton.style.display = "inline-block"
}

function playImpostor() {
    const impostorIndex = Math.floor(Math.random() * gameState.players.length) // O índice do impostor é escolhido aleatoriamente.
    const currentWord = drawWord()

    secretMessages = gameState.players.map((_, index) => // O _ representa o jogador atual, mas não é preciso usar o objeto inteiro, apenas o índice.

        // Se o índice do jogador for igual ao índice escolhido para o impostor ele recebe "Você é o IMPOSTOR!" se não, ele recebe "Sua palavra é [palavra]".
        index === impostorIndex ? "Você é o IMPOSTOR!" : `Sua palavra é ${currentWord}`
    );
    currentPlayerIndex = 0
    revealedWord = false
    // Garante que toda nova partida comece pelo primeiro jogador e com a palavra escondida.

    showScreen(distributionPanel)
    distributionPanelUpdate()
}