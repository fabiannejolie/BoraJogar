// Armazena os dados atuais do jogo.

const gameState = {
  players: [], // Armazena os jogadores cadastrados.
  matchResults: [], // Armazena o resultado de cada partida finalizada.
  currentGame: {
    // Armazena as configurações da partida atual.
    impostorCount: 1,
    durationSeconds: 60,
    impostorIndexes: [],
    eliminatedPlayerIndexes: [],
    word: '',
    winners: []
  }
}
