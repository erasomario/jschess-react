const { apiRequest } = require("../utils/ApiClient")

const createGame = async (apiKey, opponentId, time, addition, color) => {
    return await apiRequest(`/v1/games/`, 'POST', apiKey, { opponentId, time, addition, color })
}

const rematch = async (user, game) => {
    return createGame(user.api_key, game.whiteId === user.id ? game.blackId : game.whiteId, game.time, game.addition, game.requestedColor)
}

const findGameById = async (gameId, apiKey) => {
    const g = await apiRequest(`/v1/games/${gameId}`, "GET", apiKey)
    return g
}

const createMove = async (apiKey, gameId, piece, src, dest, prom) => {
    return await apiRequest(`/v1/games/${gameId}/moves`, 'POST', apiKey, { piece, src, dest, prom })
}

const createMoveSocket = async (emitterFx, gameId, piece, src, dest, prom) => {
    emitterFx("createMove", { gameId, piece, src, dest, prom })
}

const createSubcriber = async (apiKey, gameId) => {
    return await apiRequest(`/v1/games/${gameId}/subscribers`, 'POST', apiKey)
}

const timeout = async (apiKey, gameId) => {
    return await apiRequest(`/v1/games/${gameId}/timeout`, 'POST', apiKey)
}

const setOpponentNotification = async (apiKey, gameId) => {
    return await apiRequest(`/v1/games/${gameId}/opponentNotification`, 'POST', apiKey)
}

const offerDraw = async (apiKey, gameId) => {
    return await apiRequest(`/v1/games/${gameId}/drawOffering`, 'POST', apiKey)
}

const acceptDraw = async (apiKey, gameId) => {
    return await apiRequest(`/v1/games/${gameId}/drawOffering`, 'PUT', apiKey, { result: "accept" })
}

const rejectDraw = async (apiKey, gameId) => {
    return await apiRequest(`/v1/games/${gameId}/drawOffering`, 'PUT', apiKey, { result: "reject" })
}

const surrender = async (apiKey, gameId) => {
    return await apiRequest(`/v1/games/${gameId}/surrender`, 'POST', apiKey)
}

const findCurrentGames = async (apiKey) => {
    return apiRequest(`/v1/games/current/`, 'GET', apiKey, null)
}

export {
    createGame,
    rematch,
    findGameById,
    createMove,
    createMoveSocket,
    createSubcriber,
    timeout,
    setOpponentNotification,
    offerDraw,
    acceptDraw,
    rejectDraw,
    surrender,
    findCurrentGames
}