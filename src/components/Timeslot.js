import React, {useState, useEffect} from 'react';
import './grid.css';

const Timeslot = ({index, selectTime, settingAvailability, name, availability, handelVote, info}) => {
    const [selected, setSelected] = useState(availability[index]);
    const [timeSlotColor, setColor] = useState(info.color);
    const [tapped, setTapped] = useState(false);

    const showNames = () => {
        console.log(info.members);
    }

    const handelDoubleTap = (timeSlot) => {
        if (tapped) {
            console.log("double tapped");
            console.log(timeSlot);
            handelVote(timeSlot);
        }
        setTapped(true);
        setTimeout(() => {
            setTapped(false)
        }, 300)
    }

    if (settingAvailability) {
        return (
            <div className={selected ? 'green timeslot' : 'timeslot'} onClick={() => {selectTime(index); setSelected(!selected)}}>
                {info.members + " " + info.votes}
            </div>
        );
    }
    else {
        return (
            <div className={`${timeSlotColor} timeslot`} onClick={() => {showNames(); handelDoubleTap(index)}}>
                {info.members + " " + info.votes}
            </div>
        );
    }
}

export default Timeslot;
