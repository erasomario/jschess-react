const { apiRequest } = require("../utils/ApiClient")

const getProfilePictureUrl = async user => {
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

module.exports = {
    getProfilePictureUrl,
    updateProfilePicture,
    removeProfilePicture,
    editUsername,
    editPassword,
    editEmail,
}