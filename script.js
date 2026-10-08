const homeScreen = document.getElementById("home-screen");
const impostor = document.getElementById("impostor");
const playButton = document.getElementById("play-button")
const backButton = document.getElementById("back-button")

function showScreen(screen) {
    homeScreen.style.display = "none";
    impostor.style.display = "none";
    screen.style.display = "block";
}