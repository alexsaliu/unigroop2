import React, { useState, useEffect } from 'react';
import './grid.css';
import Timeslot from './Timeslot.js';

import {
    checkGroupRequest,
    groupInfoRequest,
    updateAvailabilityRequest,
    updateVoteRequest
} from '../requests.js';

const initializeAvailability = (numberOfTimeslots) => {
    let data = [];
    for( let i = 0; i < numberOfTimeslots; i++) {
        if (i === 10 )data.push(1);
        if (i !== 10 )data.push(0);
    }
    return data
}

const Grid = () => {
    const [timeSlots, setTimeSlots] = useState("");
    const [availability, setAvailability] = useState(initializeAvailability(168));
    const [groupLink, setGroupLink] = useState("");
    const [groupMembers, setGroupMembers] = useState("");
    const [groupScreen, setGroupScreen] = useState((localStorage.getItem("groupScreen") === 'true'));
    const [vote, setVote] = useState(-1);
    const [nameInput, setNameInput] = useState("");
    const [promptName, setPromptName] = useState(false);
    const [userName, setUserName] = useState("");

    useEffect(() => {
        let link = window.location.pathname;
        link = link.split('/')[1];
        const checkGroup = async () => {
            const check = await checkGroupRequest(link);
            console.log("Group Check: ", check);
            if (!check.success) window.location = '/';
            setGroupLink(link);
            handelName(link);
        }
        checkGroup();
    }, [])

    const handelName = (link) => {
        if (!localStorage.getItem("groups")) {
            localStorage.setItem("groups", "{}");
            setPromptName(true);
        }
        else {
            let groups = JSON.parse(localStorage.getItem("groups"));
            if (groups[link]) {
                setUserName(groups[link]);
                renderGrid(link, groups[link]);
            }
            else {
                setPromptName(true);
            }
        }
    }

    const handelSettingName = (link, name) => {
        let groups = JSON.parse(localStorage.getItem("groups"));
        groups[link] = name;
        localStorage.setItem("groups", JSON.stringify(groups));
        setUserName(nameInput);
        setPromptName(false);
        renderGrid(groupLink, name);
    }

    const renderGrid = async (link, name) => {
        const info = await groupInfoRequest(link);
        let t = []
        let allTimeSlots = [];
        for (let i = 0; i < 168; i++) {
            let timeSlotInfo = {"members": [], "votes": [], "color": ""};
            for (let j = 0, len = info.length; j < len; j++) {
                if (info[j].availability[i] === "1") timeSlotInfo.members.push(info[j].member_name);
                if (info[j].vote == i) timeSlotInfo.votes.push(info[j].member_name);
                if (info[j].vote == i && info[j].member_name === name) setVote(info[j].vote);
                timeSlotInfo.color = determineColor(timeSlotInfo.members.length, info.length);

                // Set availability
                if (info[j].member_name === name) {
                    const userAvailability = info[j].availability.split("").map(Number);
                    setAvailability(userAvailability);
                    console.log("userAvailability: ", userAvailability);
                }
            }
            allTimeSlots.push(timeSlotInfo);
        }
        let members = []
        for (let i = 0; i < info.length; i++) {
            members.push(info[i].member_name);
        }
        setGroupMembers(members);
        setTimeSlots(allTimeSlots);
    }

    const determineColor = (availableMembers, totalMembers) => {
        const percentage = availableMembers / totalMembers * 100;
        if (percentage === 0) return "";
        if (percentage < 25) return "red";
        if (percentage < 50) return "orange";
        if (percentage < 75) return "yellow";
        return "green";
    }

    const selectTime = (index) => {
        let currentAvailability = availability;
        currentAvailability[index] = !currentAvailability[index] ? 1 : 0;
        setAvailability(currentAvailability);
        console.log(currentAvailability);
    }

    const updateAvailability = async (link, name, userAvailability) => {
        userAvailability = userAvailability.join('');
        console.log("updating availability: ", userAvailability);
        const update = await updateAvailabilityRequest(link, name, userAvailability);
        console.log("Update: ", update);
    }

    const handelVote = async (vote) => {
        updateVote(groupLink, userName, vote);
    }

    const updateVote = async (link, name, vote) => {
        const updatedVote = await updateVoteRequest(link, name, vote);
        console.log("updatedVote: ", updatedVote);
        setVote(updatedVote.vote);
    }

    const toggleScreens = (toggle) => {
        localStorage.setItem("groupScreen", toggle)
        setGroupScreen(toggle);
    }

    if (promptName) {
        return (
            <div>
                <input onChange={(e) => setNameInput(e.target.value)} type="text" />
                <button onClick={() => handelSettingName(groupLink, nameInput)}>Submit Name</button>
            </div>
        );
    }
    else if (timeSlots) {
        return (
            <div className="grid-container">
                <div className="grid-days">
                    Monday
                </div>
                <div className="grid-times">
                    8am
                </div>
                <div className="members">{groupMembers}</div>
                <button onClick={() => toggleScreens(!groupScreen)}>{groupScreen ? "Change Availability" : "View Group"}</button>
                {!groupScreen ? <button onClick={() => updateAvailability(groupLink, userName, availability)}>Update Availability</button> : ''}
                <div className="grid">
                    {timeSlots.map((timeSlot, i) =>
                        <Timeslot
                            key={i}
                            index={i}
                            info={timeSlot}
                            selectTime={selectTime}
                            groupScreen={groupScreen}
                            availability={availability}
                            handelVote={handelVote}
                            vote={vote}
                        />
                    )}
                </div>
            </div>
        );
    }
    else {
        return (
            <div>Loading...</div>
        );
    }
}

export default Grid;
