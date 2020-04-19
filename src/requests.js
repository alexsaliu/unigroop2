const checkGroupRequest = (link) => {
    return fetch('http://localhost:3001/check-group', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({link})
    })
    .then((response) => response.json())
    .then((data) => {
        console.log("1: ", data)
      return data;
    })
    .catch((err) => {
        console.log("1")
        return err;
    })
}

const createGroupRequest = (name) => {
    return fetch('http://localhost:3001/create-group', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name})
    })
    .then((response) => response.json())
    .then((data) => {
        return data;
    })
    .catch((err) => console.log("Error: ", err))
}

const groupInfoRequest = (link) => {
    return fetch(`http://localhost:3001/group-info/${link}`)
    .then((response) => response.json())
    .then((data) => {
        return data
    })
    .catch((err) => {
        return err;
    })
}

const updateAvailabilityRequest = (link, name, availability) => {
    return fetch('http://localhost:3001/update-availability', {
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

module.exports = {
    checkGroupRequest,
    createGroupRequest,
    groupInfoRequest,
    updateAvailabilityRequest
};
