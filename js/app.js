// Conecta os botões às funções.

const playButton = document.getElementById("play-button")
const backButton = document.getElementById("back-button")
const confirmPlayersNumberButton = document.getElementById("btn-confirm-players-number")
const playersNameForm = document.getElementById("players-name-form")
const revealButton = document.getElementById("reveal-button")
const nextButton = document.getElementById("next-button")

playButton.addEventListener("click", () => showScreen(impostor))
playersNumberButton.addEventListener("click", openAmountOfPlayers)
backButton.addEventListener("click", () => showScreen(homeScreen))
confirmPlayersNumberButton.addEventListener("click", register)
playersNameForm.addEventListener("submit", (event) => savePlayers(event, impostor))
startImpostorButton.addEventListener("click", playImpostor)
revealButton.addEventListener("click", function () {
    revealedWord = true
    distributionPanelUpdate()
    // O segredo aparece, o botão de revelar desaparece e o botão de passar aparece.
});

nextButton.addEventListener("click", function () {
    // O segredo deixa de aparecer
    revealedWord = false
    secretInformation.textContent = ""

    // Se for o último jogador, encerra a distribuição
    if (currentPlayerIndex === gameState.jogadores.length - 1) {
        currentPlayerIndex = 0
        revealedWord = false
        showScreen(homeScreen)
        return
    }

    // Avança para o próximo jogador.
    currentPlayerIndex++

    distributionPanelUpdate()
});