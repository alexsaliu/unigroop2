import React, { useState, useEffect } from 'react';
import './grid.css';
import Timeslot from './Timeslot.js';

import {
    checkGroupRequest,
    groupInfoRequest
} from '../requests.js';

const Grid = () => {
    // const [timeSlots, setTimeSlots] = useState(['0', '0']);
    const [timeSlots, setTimeSlots] = useState([]);
    const [availability, setAvailability] = useState([]);

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
            const groupInfo = await groupInfoRequest(link);
            console.log(groupInfo);
            return groupInfo;
        }
    }

    const renderGrid = (info) => {
        let t = []
        for (let i = 0; i < 168; i++) {
            let timeSlotInfo = {"members": [], "votes": []};
            for (let j = 0, len = info.length; j < len; j++) {
                if (info[j].availability[i] === "1") timeSlotInfo.members.push(info[j].member_name);
                if (info[j].vote == i) timeSlotInfo.votes.push(info[j].vote);
            }
            setTimeSlots(timeSlots => [...timeSlots, timeSlotInfo]);
            // setTimeout(() => {
            //     setTimeSlots(timeSlots => [...timeSlots, 0]);
            // }, 10 * i)
        }
    }

    const selectTime = (index) => {
        let availability = timeSlots;
        availability[index] = !availability[index];
        setTimeSlots(availability);
    }

    return (
        <div className="grid-container">
            <div className="grid-days">

            </div>
            <div className="grid">
                {timeSlots.map((item, i) =>  <Timeslot key={i} index={i} members={item.members} votes={item.votes} selectTime={selectTime} /> )}
            </div>
        </div>
    );
}

export default Grid;
