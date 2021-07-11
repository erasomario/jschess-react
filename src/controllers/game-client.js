const { apiRequest } = require("../utils/ApiClient")

const createGame = async (apiKey, playerId, time, addition, color) => {
    return await apiRequest(`v1/games/`, 'POST', apiKey, { playerId, time, addition, color })
}

module.exports = {
    createGame,
}