const playersNumberButton = document.getElementById("players-number")
const startImpostorButton = document.getElementById("start-impostor-button") // Inicia o jogo
const currentPlayerName = document.getElementById("current-player-name") // Mostra "Vez de [nome-do-jogador-atual]".
const instruction = document.getElementById("instruction")
const secretArea = document.getElementById("secret-area") // Contém a informação secreta.
const secretInformation = document.getElementById("secret-information") // Mostra a palavra.
let currentPlayerIndex = 0
let revealedWord = false
let informacoesSecretas = [] // Armazena uma informação para cada jogador.

function showImpostorStartButton() {
    playersNumberButton.style.display = "none"
    startImpostorButton.style.display = "inline-block"
}

function playImpostor() {
    const impostorIndex = Math.floor(Math.random() * gameState.jogadores.length) // O índice do impostor é escolhido aleatoriamente.
    const palavra = "PRAIA"

    informacoesSecretas = gameState.jogadores.map((_, index) => // O _ representa o jogador atual, mas não é preciso usar o objeto inteiro, apenas o índice.

        // Se o índice do jogador for igual ao índice escolhido para o impostor ele recebe "Você é o IMPOSTOR!" se não, ele recebe "Sua palavra é [palavra]".
        index === impostorIndex ? "Você é o IMPOSTOR!" : `Sua palavra é ${palavra}`
    );
    currentPlayerIndex = 0
    revealedWord = false
    // Garante que toda nova partida comece pelo primeiro jogador e com a palavra escondida.

    showScreen(distributionPanel)
    distributionPanelUpdate()
}