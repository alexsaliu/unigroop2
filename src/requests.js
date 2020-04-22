const api = 'http://localhost:3001';

const checkGroupRequest = (link) => {
    return fetch(`${api}/check-group`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({link})
    })
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((err) => {
        return err;
    })
}

const createGroupRequest = (name, privateGroup) => {
    return fetch(`${api}/create-group`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name, privateGroup})
    })
    .then((response) => response.json())
    .then((data) => {
        return data;
    })
    .catch((err) => console.log("Error: ", err))
}

const joinGroupRequest = (link, name, privateGroup) => {
    return fetch(`${api}/join-group`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({link, name, privateGroup})
    })
    .then((response) => response.json())
    .then((data) => {
        return data;
    })
    .catch((err) => console.log("Error: ", err))
}

const updateVoteRequest = (link, name, vote) => {
    return fetch(`${api}/vote`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({link, name, vote})
    })
    .then((response) => response.json())
    .then((data) => {
        return data;
    })
    .catch((err) => console.log("Error: ", err))
}

const groupInfoRequest = (link) => {
    return fetch(`${api}/group-info/${link}`)
    .then((response) => response.json())
    .then((data) => {
        return data
    })
    .catch((err) => {
        return err;
    })
}

const updateAvailabilityRequest = (link, name, availability) => {
    return fetch(`${api}/update-availability`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({link, name, availability})
    })
    .then((response) => response.json())
    .then((data) => {
        return data;
    })
    .catch((err) => console.log("Error: ", err))
}

const removeMemberRequest = (link, member) => {
    return fetch(`${api}/remove-member`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({link, member})
    })
    .then((response) => response.json())
    .then((data) => {
        return data;
    })
    .catch((err) => console.log("Error: ", err))
}

module.exports = {
    checkGroupRequest,
    createGroupRequest,
    joinGroupRequest,
    groupInfoRequest,
    updateAvailabilityRequest,
    updateVoteRequest,
    removeMemberRequest
};
