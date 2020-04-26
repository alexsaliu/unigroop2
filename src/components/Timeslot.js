import React, {useState, useEffect} from 'react';
import './grid.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faStar } from '@fortawesome/free-solid-svg-icons';

const Timeslot = ({index, selectTime, groupScreen, availability, selectVote, info, vote, numOfMembers}) => {
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
                <div style={{border: vote == index ? '1px solid black' : '', boxShadow: numOfMembers > 0 && (info.votes.length ? info.votes.length : 1) / numOfMembers > 0.66 ? '0px 0px 6px 0px black' : ''}} className={`${info.color} timeslot`} onClick={() => {showNames(); handelDoubleTap(index)}}>
                    {/* {info.members.length > 0 ? <div className="timeslot-members"><span><FontAwesomeIcon icon={faUser} /></span>{info.members.length}</div> : ''} */}
                    {info.votes.length > 0 ? <div className="timeslot-votes"><span><FontAwesomeIcon icon={faStar} /></span>{info.votes.length}</div> : ''}
                    {/* {vote == index ? vote : ''} */}
                    {}
                </div>
            </div>
        );
    }
}

export default Timeslot;
