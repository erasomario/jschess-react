const { apiRequest } = require("../utils/ApiClient")

const createGame = async (apiKey, opponentId, time, addition, color) => {
    return await apiRequest(`/v1/games/`, 'POST', apiKey, { opponentId, time, addition, color })
}

const findGameById = async (gameId, apiKey) => {
    const g = await apiRequest(`/v1/games/${gameId}`, "GET", apiKey)
    return g
}

const createMove = async (apiKey, gameId, piece, src, dest, cast, prom) => {
    return await apiRequest(`/v1/games/${gameId}/moves`, 'POST', apiKey, { piece, src, dest, cast, prom })
}

const timeout = async (apiKey, gameId) => {
    return await apiRequest(`/v1/games/${gameId}/timeout`, 'POST', apiKey)
}

module.exports = {
    createGame,
    findGameById,
    createMove,
    timeout
}