import React, {useState, useEffect} from 'react';
import './grid.css';

const Timeslot = ({index, selectTime, members, votes, settingAvailability, color, name, availability}) => {
    const [selected, setSelected] = useState(availability[index]);
    const [timeSlotColor, setColor] = useState(color);

    const showNames = () => {
        console.log(members);
    }

    if (settingAvailability) {
        return (
            <div className={selected ? 'green timeslot' : 'timeslot'} onClick={() => {selectTime(index); setSelected(!selected)}}>
                {members + " " + votes}
            </div>
        );
    }
    else {
        return (
            <div className={`${timeSlotColor} timeslot`} onClick={() => showNames()}>
                {members + " " + votes}
            </div>
        );
    }
}

export default Timeslot;
