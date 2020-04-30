import React, {useState, useEffect} from 'react';
import './grid.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faStar } from '@fortawesome/free-solid-svg-icons';

const Timeslot = ({index, selectTime, groupScreen, availability, selectVote, info, vote, numOfMembers, openPopup}) => {
    const [selected, setSelected] = useState(availability[index]);
    const [tapped, setTapped] = useState(false);
    const [voteComplete, setVoteComplete] = useState(false);

    useEffect(() => {
        if (info.votes.length / numOfMembers > 0.66) {
            setVoteComplete(true);
        }
    }, [info, numOfMembers])

    const showTimeDetails = () => {
        openPopup(info.members, info.votes);
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
                <div className={selected ? 'grey timeslot' : 'timeslot'} onClick={() => {selectTime(index); setSelected(!selected)}}>
                    {""}
                </div>
            </div>
        );
    }
    else {
        return (
            <div style={{boxShadow:  parseInt(vote) === index ? 'inset 0px 0px 5px 0px #3f00ff' : ''}} className="timeslot-container">
                <div style={{background: voteComplete ? 'black' : '', color: voteComplete ? 'white' : ''}} className={`${info.color} timeslot`} onClick={() => {showTimeDetails(); handelDoubleTap(index)}}>
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
