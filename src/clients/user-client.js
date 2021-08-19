const { apiRequest } = require("../utils/ApiClient")

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

const removeProfilePicture = (user) => {
    return apiRequest(`/v1/users/${user.id}/picture`, 'DELETE', user.api_key, null)
}

const updateProfilePicture = (user, file) => {
    return apiRequest(`/v1/users/${user.id}/picture`, 'PUT', user.api_key, file)
}

const editUsername = (user, password, newUsername) => {
    return apiRequest(`/v1/users/${user.id}/username`, 'PUT', user.api_key, { password, newUsername })
}

const editPassword = (user, password, newPassword) => {
    return apiRequest(`/v1/users/${user.id}/password`, 'PUT', user.api_key, { password, newPassword })
}

const editEmail = (user, password, newEmail) => {
    return apiRequest(`/v1/users/${user.id}/email`, 'PUT', user.api_key, { password, newEmail })
}

const editLang = (user, lang) => {
    return apiRequest(`/v1/users/${user.id}/lang`, 'PUT', user.api_key, { lang })
}

const editBoardOpts = (user, options) => {
    return apiRequest(`/v1/users/${user.id}/boardOptions`, 'PUT', user.api_key, options)
}

const addUser = async (username, email, password, lang, file) => {
    const usr = await apiRequest(`/v1/users/`, 'POST', null, { username, email, password, lang })
    if (file) {
        await apiRequest(`/v1/users/${usr.id}/picture`, 'PUT', usr.api_key, file)
        return usr
    } else {
        return usr
    }
}

const generateRecoveryKey = login => {
    return apiRequest('/v1/recovery_keys/', 'POST', null, { login })
}

const recoverPassword = (id, recoveryKey, password) => {
    return apiRequest(`/v1/users/${id}/password/recovery`, 'POST', null, { recoveryKey, password })
}

const findUsersLike = (like, apiKey) => {
    return apiRequest(`/v1/users/like/${like}`, 'GET', apiKey, null)
}

const findGamesByStatus = (userId, apiKey, status) => {
    return apiRequest(`/v1/users/${userId}/games/${status}`, 'GET', apiKey, null)
}

const findUserById = (userId, apiKey) => {
    return apiRequest(`/v1/users/${userId}`, 'GET', apiKey, null)
}

const findNotNotifiedGamesCount = (userId, apiKey) => {
    return apiRequest(`/v1/users/${userId}/notNotifiedGamesCount`, 'GET', apiKey, null)
}

const createTranslation = (key, eng, esp) => {
    return apiRequest(`/v1/api_keys/translation`, 'POST', null, { key, eng, esp })
}

const createGuest = lang => {
    return apiRequest('/v1/api_keys', 'POST', null, { lang })
}


export {
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
    findUserById,
    findNotNotifiedGamesCount,
    createTranslation
}