const { apiRequest } = require("../utils/ApiClient")

const getProfilePictureUrl = async (user) => {
    if (user?.hasPicture) {
        const r = await apiRequest(`/v1/users/${user.id}/picture`, 'GET', user.api_key, null)
        const blob = await r.blob()
        return URL.createObjectURL(blob)
    } else {
        return `/assets/nopp.svg`
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

const addUser = async (username, email, password, file) => {
    const usr = await apiRequest(`/v1/users/`, 'POST', null, { username, email, password })
    if (file) {
        await apiRequest(`/v1/users/${usr.id}/picture`, 'PUT', usr.api_key, file)
        return usr
    } else {
        return usr
    }
}

const generateRecoveryKey = async (login) => {
    return apiRequest('/v1/recovery_keys/', 'POST', null, { login })
}

const recoverPassword = async (id, recoveryKey, password) => {
    return apiRequest(`/v1/users/${id}/password/recovery`, 'POST', null, { recoveryKey, password })
}

const findUsersLike = async (like, apiKey) => {
    return apiRequest(`/v1/users/like/${like}`, 'GET', apiKey, null)
}

const findGamesByStatus = async (userId, apiKey, status) => {
    return apiRequest(`/v1/users/${userId}/games/${status}`, 'GET', apiKey, null)
}

export {
    addUser,
    getProfilePictureUrl,
    updateProfilePicture,
    removeProfilePicture,
    editUsername,
    editPassword,
    editEmail,
    generateRecoveryKey,
    recoverPassword,
    findUsersLike,
    findGamesByStatus
}