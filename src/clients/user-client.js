const { apiRequest } = require("../utils/ApiClient")

const login = (login, password, lang) => {
    return apiRequest('/v1/api_keys', 'POST', null, { login, password, lang })
}

const getProfilePictureUrl = async (userId, hasPicture, apiKey) => {
    console.log("getting profile picture for ", userId)
    if (hasPicture) {
        if (userId) {
            const r = await apiRequest(`/v1/users/${userId}/picture`, 'GET', apiKey, null)
            const blob = await r.blob()
            return URL.createObjectURL(blob)
        } else {
            return `${process.env.PUBLIC_URL}/assets/bot.svg`
        }
    } else {
        return `${process.env.PUBLIC_URL}/assets/nopp.svg`
    }
}

const removeProfilePicture = (user, apiKey) => {
    return apiRequest(`/v1/users/${user.id}/picture`, 'DELETE', apiKey, null)
}

const updateProfilePicture = (user, file, apiKey) => {
    return apiRequest(`/v1/users/${user.id}/picture`, 'PUT', apiKey, file)
}

const editUsername = (user, password, newUsername, apiKey) => {
    return apiRequest(`/v1/users/${user.id}/username`, 'PUT', apiKey, { password, newUsername })
}

const editPassword = (user, password, newPassword, apiKey) => {
    return apiRequest(`/v1/users/${user.id}/password`, 'PUT', apiKey, { password, newPassword })
}

const editEmail = (user, password, newEmail, apiKey) => {
    return apiRequest(`/v1/users/${user.id}/email`, 'PUT', apiKey, { password, newEmail })
}

const editLang = (user, lang, apiKey) => {
    return apiRequest(`/v1/users/${user.id}/lang`, 'PUT', apiKey, { lang })
}

const editBoardOpts = (user, options, apiKey) => {
    return apiRequest(`/v1/users/${user.id}/boardOptions`, 'PUT', apiKey, options)
}

const addUser = async (username, email, password, lang, guestId, file) => {
    const apiKey = (await apiRequest(`/v1/users/`, 'POST', null, { username, email, password, lang, guestId }))    
    if (file) {
        const user = await findUserByApiKey(apiKey)
        await apiRequest(`/v1/users/${user.id}/picture`, 'PUT', apiKey, file)
        return apiKey
    } else {
        return apiKey
    }
}

const generateRecoveryKey = (login, lang) => {
    return apiRequest('/v1/recovery_keys/', 'POST', null, { login, lang })
}

const recoverPassword = (id, recoveryKey, password) => {
    return apiRequest(`/v1/users/${id}/password/recovery`, 'POST', null, { recoveryKey, password })
}

const findUsersLike = (like, apiKey) => {
    return apiRequest(`/v1/users/like/${like}`, 'GET', apiKey, null)
}

const findGamesByStatus = (userId, status, apiKey) => {
    return apiRequest(`/v1/users/${userId}/games/${status}`, 'GET', apiKey, null)
}

const findUserByApiKey = apiKey => {
    return apiRequest(`/v1/users/`, 'GET', apiKey, null)
}

const findNotNotifiedGamesCount = (userId, apiKey) => {
    return apiRequest(`/v1/users/${userId}/notNotifiedGamesCount`, 'GET', apiKey, null)
}

const createGuest = lang => {
    return apiRequest('/v1/api_keys', 'POST', null, { lang })
}

export {
    login,
    addUser,
    createGuest,
    getProfilePictureUrl,
    updateProfilePicture,
    removeProfilePicture,
    editUsername,
    editPassword,
    editEmail,
    editLang,
    editBoardOpts,
    generateRecoveryKey,
    recoverPassword,
    findUsersLike,
    findGamesByStatus,
    findUserByApiKey,
    findNotNotifiedGamesCount
}