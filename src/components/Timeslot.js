import React, {useState, useEffect} from 'react';
import './grid.css';

const Timeslot = ({index, selectTime, groupScreen, availability, handelVote, info, vote}) => {
    const [selected, setSelected] = useState(availability[index]);
    const [timeSlotColor, setColor] = useState(info.color);
    const [tapped, setTapped] = useState(false);

    const showNames = () => {
        console.log(info.members);
    }

    const handelDoubleTap = (timeSlot) => {
        if (tapped) {
            handelVote(timeSlot);
        }
        setTapped(true);
        setTimeout(() => {
            setTapped(false);
        }, 300)
    }

    if (!groupScreen) {
        return (
            <div className={selected ? 'green timeslot' : 'timeslot'} onClick={() => {selectTime(index); setSelected(!selected)}}>
                {""}
            </div>
        );
    }
    else {
        return (
            <div className={`${timeSlotColor} timeslot`} onClick={() => {showNames(); handelDoubleTap(index)}}>
                {info.members + " " + info.votes}
                {vote == index ? vote : ''}
            </div>
        );
    }
}

export default Timeslot;
