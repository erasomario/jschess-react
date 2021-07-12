const { apiRequest } = require("../utils/ApiClient")

const createGame = async (apiKey, opponentId, time, addition, color) => {
    return await apiRequest(`/v1/games/`, 'POST', apiKey, { opponentId, time, addition, color })
}

const findGameById = async (gameId, apiKey) => {
    return await apiRequest(`/v1/games/${gameId}`, "GET", apiKey)
}

module.exports = {
    createGame,
    findGameById
}