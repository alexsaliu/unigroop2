import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import './grid.css';
import Timeslot from './Timeslot.js';
import { prepareGridData } from '../helpers.js';
import {
    checkGroupRequest,
    groupInfoRequest,
    updateAvailabilityRequest,
    updateVoteRequest
} from '../requests.js';

const api = 'http://localhost:3001';

// Socket io connection with server
const socket = socketIOClient(api);

// socket.on(`message`, (message) => {
//     console.log("MESSAGE: ", message);
// })



    // console.log("OK");
// }

const Grid = ({groupLink, userName}, updatedSocket) => {
    const [timeSlots, setTimeSlots] = useState("");
    const [availability, setAvailability] = useState("");
    const [groupMembers, setGroupMembers] = useState("");
    const [groupScreen, setGroupScreen] = useState((localStorage.getItem("groupScreen") === 'true'));
    const [vote, setVote] = useState(-1);

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

    const sendMessage = () => {
        socket.emit('message', { userName, groupLink });
    }
    const test = () => {
        console.log("KODJWSIBHBV");
    }


    // socket.on(`update`, (message) => {
    //     console.log("MESSAGE: ", message);
    //     renderGrid(groupLink, userName, message);
    // })

    const renderGrid = async (link, name, info) => {
        const gridData = prepareGridData(link, name, info);
        let members = [];
        for (let i = 0; i < info.length; i++) {
            members.push(info[i].member_name);
            // Set availability
            if (info[i].member_name === name) {
                const userAvailability = info[i].availability.split("").map(Number);
                setAvailability(userAvailability);
            }
        }
        setGroupMembers(members);
        setVote(gridData.vote);
        setTimeSlots(gridData.allTimeSlots);
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
        emitUpdate(name, link);
    }

    const updateVote = async (link, name, vote) => {
        const updatedVote = await updateVoteRequest(link, name, vote);
        console.log("updatedVote: ", updatedVote);
        emitUpdate(name, link);
    }

    const emitUpdate = (name, link) => {
        socket.emit('update', { 'userName': name, 'groupLink': link });
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
