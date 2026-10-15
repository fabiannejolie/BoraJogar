// Responsável pela navegação entre as telas.

const homeScreen = document.getElementById("home-screen")
const impostor = document.getElementById("impostor")
const amountOfPlayers = document.getElementById("amount-of-players")
const playersName = document.getElementById("players-name")
const distributionPanel = document.getElementById("distribution-panel")
const configImpostorScreen = document.getElementById("config-impostor-screen")
const votingScreen = document.getElementById("voting-screen")

// Desabilita as outras telas e mostra apenas a selecionada.
function showScreen(screen) {
    homeScreen.style.display = "none"
    impostor.style.display = "none"
    amountOfPlayers.style.display = "none"
    playersName.style.display = "none"
    distributionPanel.style.display = "none"
    configImpostorScreen.style.display = "none"
    votingScreen.style.display = "none"
    screen.style.display = "block"
}

// Coloca um blur e impede cliques na tela anterior e mostra a tela de quantidade de jogadores.
function openAmountOfPlayers() {
    impostor.style.filter = "blur(1.5rem)"
    impostor.style.pointerEvents = "none"

    amountOfPlayers.style.display = "block"
}

function distributionPanelUpdate() {
    const player = gameState.players[currentPlayerIndex]

    if (!player) { // Se o índice não encontrar nenhum jogador, a função é encerrada sem causar erro.
        return;
    }

    currentPlayerName.textContent = `Vez de ${player.name.toUpperCase()}`

    // Esconde o segredo sempre que a tela é atualizada
    secretArea.hidden = !revealedWord

    // O botão de revelar só aparece antes da revelação
    revealButton.hidden = revealedWord

    // O botão de passar só aparece depois da revelação
    nextButton.hidden = !revealedWord

    // O último jogador terá um botão de finalizar
    if (currentPlayerIndex === gameState.players.length - 1) {
        nextButton.textContent = "Finalizar"
    } else {
        nextButton.textContent = "Passar para o próximo"
    }

    // A informação exibida corresponde ao jogador atual.
    if (revealedWord) { 
        secretInformation.textContent =
            secretMessages[currentPlayerIndex]
        instruction.textContent = currentPlayerIndex === gameState.players.length - 1
            ? "Memorize sua informação e finalize a distribuição." // Para o último jogador.
            : "Memorize sua informação e passe o celular." // Para jogadores que ainda precisam passar o celular
    } else { // Antes da revelação.
        secretInformation.textContent = ""
        instruction.textContent = "Passe o celular para o jogador indicado."
    }
}
