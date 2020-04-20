import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import './grid.css';
import Timeslot from './Timeslot.js';
import {
    checkGroupRequest,
    groupInfoRequest,
    updateAvailabilityRequest,
    updateVoteRequest
} from '../requests.js';

const api = 'http://localhost:3001';

const Grid = ({groupLink, userName}) => {
    const [timeSlots, setTimeSlots] = useState("");
    const [availability, setAvailability] = useState("");
    const [groupMembers, setGroupMembers] = useState("");
    const [groupScreen, setGroupScreen] = useState((localStorage.getItem("groupScreen") === 'true'));
    const [vote, setVote] = useState(-1);
    const [socket, setSocket] = useState("");

    useEffect(() => {
        const getGroupInfo = async () => {
            const info = await groupInfoRequest(groupLink);
            console.log("Group Info: ", info);
            renderGrid(groupLink, userName, info);
        }
        getGroupInfo();
        // Socket io connection with server
        setSocket(socketIOClient(api));

    }, [])

    const sendMessage = () => {
        socket.emit('updated');
    }

    const renderGrid = async (link, name, info) => {
        let allTimeSlots = [];
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
                if (info[j].vote == i && info[j].member_name === name) setVote(info[j].vote);

                // Set availability
                if (info[j].member_name === name) {
                    const userAvailability = info[j].availability.split("").map(Number);
                    setAvailability(userAvailability);
                }
            }
            allTimeSlots.push(timeSlotInfo);
        }
        let members = [];
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

    if (timeSlots) {
        return (
            <div className="grid-container">
                <button onClick={() => sendMessage()}>Socket</button>
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
