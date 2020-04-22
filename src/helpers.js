const determineColor = (availableMembers, totalMembers) => {
    const percentage = availableMembers / totalMembers * 100;
    if (percentage === 0) return "";
    if (percentage < 25) return "red";
    if (percentage < 50) return "orange";
    if (percentage < 75) return "yellow";
    return "green";
}
const prepareGridData = (link, name, info) => {
    let allTimeSlots = [];
    let vote = [];
    for (let i = 0; i < 168; i++) {
        let timeSlotInfo = {"members": [], "votes": [], "color": ""};
        for (let j = 0, len = info.length; j < len; j++) {
            // Set available members for current timeslot
            if (info[j].availability[i] === "1") timeSlotInfo.members.push(info[j].member_name);
            // Set members who voted for current timeslot
            if (info[j].vote == i) timeSlotInfo.votes.push(info[j].member_name);
            // Detemine color for timeslot
            timeSlotInfo.color = determineColor(timeSlotInfo.members.length, info.length);
            // Capture vote is user voted for current timeslot
            if (info[j].vote == i && info[j].member_name === name) vote = info[j].vote;
        }
        allTimeSlots.push(timeSlotInfo);
    }
    return { allTimeSlots, vote };
}

const setScreen = (link, toggle) => {
    let groups = JSON.parse(localStorage.getItem("groups"));
    groups[link].groupScreen = toggle;
    localStorage.setItem('groups', JSON.stringify(groups));
}

module.exports = {
    prepareGridData,
    setScreen
}
