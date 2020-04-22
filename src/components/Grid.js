import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import './grid.css';
import Timeslot from './Timeslot.js';
import {
    prepareGridData,
    setScreen
 } from '../helpers.js';
import {
    checkGroupRequest,
    groupInfoRequest,
    updateAvailabilityRequest,
    updateVoteRequest,
    removeMemberRequest
} from '../requests.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const api = 'http://localhost:3001';

// Socket io connection with server
const socket = socketIOClient(api);

const Grid = ({groupLink, userName, screen}, updatedSocket) => {
    const [timeSlots, setTimeSlots] = useState("");
    const [availability, setAvailability] = useState("");
    const [groupMembers, setGroupMembers] = useState("");
    const [groupScreen, setGroupScreen] = useState(screen);
    const [vote, setVote] = useState(-1);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const getGroupInfo = async () => {
            const info = await groupInfoRequest(groupLink);
            console.log("Group Info: ", info);
            renderGrid(groupLink, userName, info);
            socket.emit('joinRoom', { userName, groupLink });
        }
        getGroupInfo();

        socket.on(`message`, (message) => {
            console.log("MESSAGE: ", message);;
        })

        socket.on(`update`, (info) => {
            console.log("MESSAGE: ", info);
            renderGrid(groupLink, userName, info);
        })
    }, [])

    const sendMessage = (message) => {
        socket.emit('message', { message });
    }
    const emitUpdate = () => {
        socket.emit('update');
    }

    const renderGrid = async (link, name, info) => {
        const gridData = prepareGridData(link, name, info);
        let members = [];
        let userIsInGroup = false;
        for (let i = 0; i < info.length; i++) {
            members.push(info[i].member_name);
            // Set availability
            if (info[i].member_name === name) {
                userIsInGroup = true;
                const userAvailability = info[i].availability.split("").map(Number);
                setAvailability(userAvailability);
            }
        }
        if (!userIsInGroup) removeUser(name);
        setGroupMembers(members);
        setVote(gridData.vote);
        setTimeSlots(gridData.allTimeSlots);
    }

    const removeUser = (name) => {
        let groups = JSON.parse(localStorage.getItem("groups"));
        delete groups[groupLink];
        localStorage.setItem("groups", JSON.stringify(groups));
        window.location = '/';
    }

    const removeMember = async (link, member) => {
        const response = await removeMemberRequest(link, member);
        if (response.success) {
            emitUpdate();
        }
        console.log(`deleting ${member}`);
        console.log(response);
    }

    const selectTime = (index) => {
        let currentAvailability = availability;
        currentAvailability[index] = !currentAvailability[index] ? 1 : 0;
        setAvailability(currentAvailability);
        console.log(currentAvailability);
    }

    const selectVote = async (vote) => {
        setVote(vote);
    }

    const updateAvailability = async (link, name, userAvailability) => {
        userAvailability = userAvailability.join('');
        const update = await updateAvailabilityRequest(link, name, userAvailability);
        console.log("Update: ", update);
        emitUpdate();
    }

    const updateVote = async (link, name, vote) => {
        const updatedVote = await updateVoteRequest(link, name, vote);
        console.log("updatedVote: ", updatedVote);
        emitUpdate();
    }

    const toggleScreens = (link, toggle) => {
        setScreen(link, !toggle);
        setGroupScreen(!toggle);
    }

    if (timeSlots) {
        return (
            <div className="grid-container">
                <button disabled={!message.length} onClick={() => sendMessage(message)}>Send Message</button>
                <input onChange={(e) => setMessage(e.target.value)} type="text" />
                <div className="grid-days">
                    Monday
                </div>
                <div className="grid-times">
                    8am
                </div>
                <div className="members">{groupMembers.map((member, i) =>
                    <div key={i}>{member}<div onClick={() => removeMember(groupLink, member)} className="trash-icon"><FontAwesomeIcon icon={faTrash} /></div></div>
                )}</div>
                <button onClick={() => toggleScreens(groupLink, groupScreen)}>{groupScreen ? "Change Availability" : "View Group"}</button>
                {!groupScreen
                ? <button onClick={() => updateAvailability(groupLink, userName, availability)}>Update Availability</button>
                : <button onClick={() => updateVote(groupLink, userName, vote)}>Update Vote</button> }
                <div className="grid">
                    {timeSlots.map((timeSlot, i) =>
                        <Timeslot
                            key={i}
                            index={i}
                            info={timeSlot}
                            selectTime={selectTime}
                            groupScreen={groupScreen}
                            availability={availability}
                            selectVote={selectVote}
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
