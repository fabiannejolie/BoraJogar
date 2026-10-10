// Conecta os botões às funções.

const playButton = document.getElementById("play-button");
const playersNumberButton = document.getElementById("players-number");
const backButton = document.getElementById("back-button");
const confirmPlayersNumberButton = document.getElementById("btn-confirm-players-number");
const playersNameForm = document.getElementById("players-name-form");

playButton.addEventListener("click", () => showScreen(impostor));
playersNumberButton.addEventListener("click", openAmountOfPlayers);
backButton.addEventListener("click", () => showScreen(homeScreen));
confirmPlayersNumberButton.addEventListener("click", register);
playersNameForm.addEventListener("submit", (event) => savePlayers(event, impostor));
