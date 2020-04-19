import React, { useState, useEffect } from 'react';
import './grid.css';
import Timeslot from './Timeslot.js';

import {
    checkGroupRequest,
    groupInfoRequest,
    updateAvailabilityRequest
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
    const [timeSlots, setTimeSlots] = useState([]);
    const [availability, setAvailability] = useState(initializeAvailability(168));
    const [settingAvailability, setSettingAvailability] = useState(true);
    const [groupLink, setGroupLink] = useState("");
    const [name, setName] = useState("alex");

    useEffect(() => {
        let path = window.location.pathname;
        path = path.split('/')[1]
        const initialize = async () => {
            const info = await retreiveGroup(path);
            renderGrid(info);
            console.log("info: ", info);
        }
        initialize();
    }, [])

    const retreiveGroup = async (link) => {
        const checkGroup = await checkGroupRequest(link);
        if (!checkGroup.success) {
            window.location = '/';
        }
        else {
            setGroupLink(link);
            const groupInfo = await groupInfoRequest(link);
            console.log(groupInfo);
            return groupInfo;
        }
    }

    const renderGrid = (info) => {
        let t = []
        for (let i = 0; i < 168; i++) {
            let timeSlotInfo = {"members": [], "votes": [], "color": ""};
            for (let j = 0, len = info.length; j < len; j++) {
                if (info[j].availability[i] === "1") timeSlotInfo.members.push(info[j].member_name);
                if (info[j].vote == i) timeSlotInfo.votes.push(info[j].vote);
                timeSlotInfo.color = determineColor(timeSlotInfo.members.length, info.length);

                // Set availability
                if (info[j].member_name === name) {
                    const userAvailability = info[j].availability.split("").map(Number);
                    setAvailability(userAvailability);
                }
            }
            setTimeSlots(timeSlots => [...timeSlots, timeSlotInfo]);
            // setTimeout(() => {
            //     setTimeSlots(timeSlots => [...timeSlots, 0]);
            // }, 10 * i)
        }
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

    const updateAvailability = async (link, username, userAvailability) => {
        userAvailability = userAvailability.join('');
        console.log("updating availability: ", userAvailability);
        const update = await updateAvailabilityRequest(link, username, userAvailability);
        console.log("Update: ", update);
    }

    return (
        <div className="grid-container">
            <div className="grid-days">

            </div>
            <button onClick={() => setSettingAvailability(!settingAvailability)}>{settingAvailability ? "View Group" : "Change Availability"}</button>
            {settingAvailability ? <button onClick={() => updateAvailability(groupLink, name, availability)}>Update Availability</button> : ''}
            <div className="grid">
                {timeSlots.map((item, i) =>
                    <Timeslot
                        key={i}
                        index={i}
                        members={item.members}
                        votes={item.votes}
                        selectTime={selectTime}
                        settingAvailability={settingAvailability}
                        color={item.color}
                        availability={availability}
                    />
                )}
            </div>
        </div>
    );
}

export default Grid;
