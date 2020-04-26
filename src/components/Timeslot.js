import React, {useState, useEffect} from 'react';
import './grid.css';

const Timeslot = ({index, selectTime, groupScreen, availability, selectVote, info, vote}) => {
    const [selected, setSelected] = useState(availability[index]);
    const [tapped, setTapped] = useState(false);

    const showNames = () => {
        console.log(info.members);
    }

    const handelDoubleTap = (timeSlot) => {
        if (tapped) {
            selectVote(timeSlot);
        }
        setTapped(true);
        setTimeout(() => {
            setTapped(false);
        }, 300)
    }

    if (!groupScreen) {
        return (
            <div className="timeslot-container">
                <div className={selected ? 'green timeslot' : 'timeslot'} onClick={() => {selectTime(index); setSelected(!selected)}}>
                    {""}
                </div>
            </div>
        );
    }
    else {
        return (
            <div className="timeslot-container">
                <div className={`${info.color} timeslot`} onClick={() => {showNames(); handelDoubleTap(index)}}>
                    {info.members + " " + info.votes}
                    {vote == index ? vote : ''}
                </div>
            </div>
        );
    }
}

export default Timeslot;
