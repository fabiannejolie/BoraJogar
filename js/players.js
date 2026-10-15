// Responsável por tudo relacionado aos jogadores.

const playersNameInputs = document.getElementById("players-name-inputs")

function register() {
    const playersQuantity = document.getElementById("input-players-number")
    const playersNumber = Number(playersQuantity.value)

    // Se o número não for inteiro OU for menor/igual a 2 OU for maior que 10 
    if (!Number.isInteger(playersNumber) || playersNumber <= 2 || playersNumber > 10) {
        window.alert("Informe uma quantidade válida de jogadores (de 3 a 10).")
        return
    }

    playersNameInputs.innerHTML = ""

    // Para cada jogador é criado uma label com "Nome do jogador" e um input para colocar cada nome. O htmlFor relaciona a label com o input.
    for (let index = 1; index <= playersNumber; index++) {
        const label = document.createElement("label")
        label.htmlFor = `player-${index}`
        label.textContent = `Nome do jogador ${index}:`

        const input = document.createElement("input")
        input.type = "text"
        input.id = `player-${index}`
        input.name = "player-name"
        input.placeholder = `Jogador ${index}`
        input.required = true;

        // Adiciona elementos dentro de outro elemento.
        playersNameInputs.append(label, input, document.createElement("br"))
    }

    impostor.style.filter = "none"

    // Permite que o usuário clique novamente nos elementos da tela.
    impostor.style.pointerEvents = "auto"
    showScreen(playersName)
}

// Coleta os nomes digitados.
function savePlayers(event, returnScreen = impostor) {

    // Impede o recarregamento padrão que pode ocorrer em formulários.
    event.preventDefault();

    // Procura todos os elementos <input> dentro de playersNameInputs.
    const playerInputs = playersNameInputs.querySelectorAll("input");
    const names = Array.from(playerInputs, (input) => input.value.trim()); // Obtém o nome digitado e remove espaços no começo e no final.
    const namesForComparison = names.map((name) => name.toLowerCase()); // Converte o nome para letras minúsculas.
    const uniqueNames = new Set(namesForComparison); // Um Set armazena apenas valores únicos. Se um valor aparecer mais de uma vez, ele será guardado apenas uma vez.

    if (uniqueNames.size !== names.length) { // Compara a quantidade total de nomes digitados e a quantidade de nomes diferentes.
        window.alert("Não é permitido repetir nomes.")
        return
    }

    gameState.players = names.map((name) => ({ // Converte cada nome em um objeto dentro do array de players.
        name // Armazena o nome já sem espaços desnecessários no início e no final.
    }));

    updateImpostorConfiguration()
    showScreen(configImpostorScreen)
}
