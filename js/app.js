// Conecta os botões às funções.

const playButton = document.getElementById("play-button")
const playersNumberButton = document.getElementById("players-number")
const backButton = document.getElementById("back-button")
const confirmPlayersNumberButton = document.getElementById("btn-confirm-players-number")
const playersNameForm = document.getElementById("players-name-form")
const revealButton = document.getElementById("reveal-button")
const nextButton = document.getElementById("next-button")
const decreaseImpostorButton = document.getElementById("decrease-impostor-quantity")
const increaseImpostorButton = document.getElementById("increase-impostor-quantity")
const decreaseTimeButton = document.getElementById("decrease-time")
const increaseTimeButton = document.getElementById("increase-time")
const impostorQuantity = document.getElementById("impostor-quantity")
const durationTime = document.getElementById("duration-time")
const startConfiguredGameButton = document.getElementById("start-configured-game")
const timerLabel = document.getElementById("base-timer-label")
const timerPath = document.getElementById("base-timer-path-remaining")
const timerCircumference = 2 * Math.PI * 45 // Valor usado para controlar o strokeDashoffset.
let timerInterval // Guarda o intervalo criado pelo setInterval.
let timeLeft = 0
const playersToVoteFor = document.getElementById("players-to-vote-for")
const votingButton = document.getElementById("voting-button")
const votingResult = document.getElementById("voting-result")
let selectedPlayerIndex = null
let votingFinished = false

playButton.addEventListener("click", () => showScreen(impostor))
playersNumberButton.addEventListener("click", openAmountOfPlayers)
backButton.addEventListener("click", () => showScreen(homeScreen))
confirmPlayersNumberButton.addEventListener("click", register)
playersNameForm.addEventListener("submit", (event) => savePlayers(event, impostor))
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
});

function formatDuration(seconds) { // Transforma segundos no formato de relógio.

    // Garante que o número tenha dois dígitos e comece com 0.
    const minutes = Math.floor(seconds / 60).toString().padStart(2, "0")
    const remainingSeconds = (seconds % 60).toString().padStart(2, "0")

    return `${minutes}:${remainingSeconds}`
}

function updateTimer() {
    timerLabel.textContent = formatDuration(timeLeft) // Mostra o tempo restante na tela.
    const progress = gameState.currentGame.durationSeconds > 0
        ? timeLeft / gameState.currentGame.durationSeconds
        : 0
    timerPath.style.strokeDashoffset = timerCircumference * (1 - progress) // Cálculo do círculo visível.
}

function startTimer() {
    clearInterval(timerInterval) // Evita que dois timers rodem ao mesmo tempo quando uma partida nova é iniciada.
    timeLeft = gameState.currentGame.durationSeconds
    timerPath.classList.remove("is-finished") 
    updateTimer()

    timerInterval = setInterval(() => {
        timeLeft = Math.max(0, timeLeft - 1) // Impede que o timer fique negativo.
        updateTimer()

        if (timeLeft === 0) {
            clearInterval(timerInterval)
            timerPath.classList.add("is-finished")
        }
    }, 1000)
}

function updateImpostorConfiguration() { // Sincroniza o estado da aplicação com a tela.
    let maximumImpostors = 3

    if (gameState.players.length <= 4){
      maximumImpostors = 1
    }

    else if (gameState.players.length <= 6){
      maximumImpostors = 2
    }

    // Se a quantidade configurada ultrapassar o máximo permitido, ela é reduzida automaticamente.
    gameState.currentGame.impostorCount = Math.min(
        gameState.currentGame.impostorCount,
        maximumImpostors
    )
    impostorQuantity.textContent = gameState.currentGame.impostorCount
    durationTime.textContent = formatDuration(gameState.currentGame.durationSeconds)
}

decreaseImpostorButton.addEventListener("click", function () {
    gameState.currentGame.impostorCount = Math.max(
        1, // Impede que fique abaixo de 1, ao tentar diminuir nesse caso, continua em 1.
        gameState.currentGame.impostorCount - 1
    )
    updateImpostorConfiguration()
})

increaseImpostorButton.addEventListener("click", function () {
    const maximumImpostors = Math.max(1, gameState.players.length - 1)

    gameState.currentGame.impostorCount = Math.min(
        maximumImpostors,
        gameState.currentGame.impostorCount + 1
    )
    updateImpostorConfiguration()
})

decreaseTimeButton.addEventListener("click", function () {
    gameState.currentGame.durationSeconds = Math.max(
        30,
        gameState.currentGame.durationSeconds - 30
    )
    updateImpostorConfiguration()
})

increaseTimeButton.addEventListener("click", function () {
    gameState.currentGame.durationSeconds += 30
    updateImpostorConfiguration()
})

startConfiguredGameButton.addEventListener("click", playImpostor)

function renderVotingPlayers() {
    playersToVoteFor.innerHTML = ""
    selectedPlayerIndex = null
    votingFinished = false
    votingButton.disabled = true
    votingResult.textContent = ""

    gameState.players.forEach((player, index) => {
        const playerButton = document.createElement("button")
        playerButton.type = "button"
        playerButton.textContent = player.name.toUpperCase()
        playerButton.setAttribute("aria-pressed", "false")

        playerButton.addEventListener("click", () => {
            if (votingFinished) {
                return
            }

            selectedPlayerIndex = index

            // Garante que apenas um jogador fique selecionado.
            playersToVoteFor.querySelectorAll("button").forEach((button) => {
                button.classList.remove("selected")
                button.setAttribute("aria-pressed", "false")
            })

            playerButton.classList.add("selected")
            playerButton.setAttribute("aria-pressed", "true")
            votingButton.disabled = false
        })

        playersToVoteFor.appendChild(playerButton)
    })
}

votingButton.addEventListener("click", () => {
    if (selectedPlayerIndex === null || votingFinished) {
        return
    }

    const votedPlayer = gameState.players[selectedPlayerIndex]
    const votedForImpostor = gameState.currentGame.impostorIndexes.includes(selectedPlayerIndex) // Verifica se o índice votado está dentro da lista de impostores.

    votingResult.textContent = votedForImpostor
        ? `Acertou! ${votedPlayer.name.toUpperCase()} era um impostor.`
        : `Você votou em ${votedPlayer.name.toUpperCase()}. Ele(a) não era um impostor.`

    clearInterval(timerInterval) // Depois do voto o timer é parado.
    votingFinished = true
    votingButton.disabled = true
    playersToVoteFor.querySelectorAll("button").forEach((button) => {
        button.disabled = true
    })
})