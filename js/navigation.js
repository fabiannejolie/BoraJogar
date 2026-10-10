// Responsável pela navegação entre as telas.

const homeScreen = document.getElementById("home-screen");
const impostor = document.getElementById("impostor");
const amountOfPlayers = document.getElementById("amount-of-players");
const playersName = document.getElementById("players-name");

// Desabilita as outras telas e mostra apenas a selecionada.
function showScreen(screen) {
    homeScreen.style.display = "none";
    impostor.style.display = "none";
    amountOfPlayers.style.display = "none";
    playersName.style.display = "none";
    screen.style.display = "block";
}

// Coloca um blur e impede cliques na tela anterior e mostra a tela de quantidade de jogadores.
function openAmountOfPlayers() {
    impostor.style.filter = "blur(1.5rem)";
    impostor.style.pointerEvents = "none";

    amountOfPlayers.style.display = "block";
}
