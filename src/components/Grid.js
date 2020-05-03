import React, { useState, useEffect, useRef } from 'react';
import shortid from "shortid";
import socketIOClient from 'socket.io-client';
import './grid.css';
import Timeslot from './Timeslot.js';
import Logo from './Logo.js';
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
import { faTrash, faCommentDots, faUsers, faLink, faChevronCircleLeft, faChevronCircleRight, faStar, faCalendarDay } from '@fortawesome/free-solid-svg-icons';

const api = 'http://localhost:3001';
// const api = 'https://unimeetsapi.herokuapp.com';

// Socket io connection with server
const socket = socketIOClient(api);

const Grid = ({groupLink, userName, screen, privateGroup}) => {
    const [timeSlots, setTimeSlots] = useState([]);
    const [availability, setAvailability] = useState("");
    const [groupMembers, setGroupMembers] = useState([]);
    const [groupScreen, setGroupScreen] = useState(screen);
    const [vote, setVote] = useState(-1);
    const [admin, setAdmin] = useState(false);
    const [message, setMessage] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);
    const [membersOpen, setMembersOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [warning, setWarning] = useState("");
    const [membersPopup, setMembersPopup] = useState(false);
    const [updateAvailabilityReady, setUpdateAvailabilityReady] = useState(false);
    const [updateVoteReady, setUpdateVoteReady] = useState(false);
    const [timeslotMembers, setTimeslotMembers] = useState([]);
    const [deleteMembers, setDeleteMembers] = useState(false);
    const [textCopied, setTextCopied] = useState(false);
    const [bounce, setBounce] = useState(false);
    const [canViewGroup, setCanViewGroup] = useState(false);

    const textAreaRef = useRef(null);

    useEffect(() => {
        const getGroupInfo = async () => {
            const info = await groupInfoRequest(groupLink);
            if (info.success === 'error') {
                setWarning("There was an error retrieving group info");
            }
            else {
                setWarning("");
                console.log("Group Info: ", info);
                renderGrid(groupLink, userName, info);
                socket.emit('joinRoom', { userName, groupLink });
            }
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
                if (!privateGroup && info[i].admin) setAdmin(true);
                const userAvailability = info[i].availability.split("").map(Number);
                for (let i = 0, len = userAvailability.length; i < len; i++) {
                    if (userAvailability[i]) {
                        setCanViewGroup(true);
                    }
                }
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
        console.log("REMOVED BITCH");
        delete groups[groupLink];
        localStorage.setItem("groups", JSON.stringify(groups));
        window.location = '/';
    }

    const removeMember = async (link, member, confirmation) => {
        if (confirmation) {
            console.log("Not saftey");
            setLoading(true);
            const response = await removeMemberRequest(link, member);
            setLoading(false);
            if (response.success === 'error') {
                setWarning("There was an error removing a member");
            }
            else if (response.success) {
                setWarning("");
                emitUpdate();
                console.log(`deleting ${member}`);
            }
            console.log(response);
        }
    }

    const selectTime = (index) => {
        setUpdateAvailabilityReady(true);
        let currentAvailability = availability;
        currentAvailability[index] = !currentAvailability[index] ? 1 : 0;
        setAvailability(currentAvailability);
        console.log(currentAvailability);
    }

    const selectVote = async (vote) => {
        setUpdateVoteReady(true);
        setVote(vote);
    }

    const updateAvailability = async (link, name, userAvailability) => {
        if (updateAvailabilityReady) {
            userAvailability = userAvailability.join('');
            setLoading(true);
            const update = await updateAvailabilityRequest(link, name, userAvailability);
            setLoading(false);
            if (update.success === 'error') {
                setWarning("There was an error updating your availability");
                setUpdateAvailabilityReady(true);
            }
            else {
                setWarning("");
                emitUpdate();
                setUpdateAvailabilityReady(false);
                setCanViewGroup(true);
                console.log("Update: ", update);
            }
        }
    }

    const updateVote = async (link, name, vote) => {
        if (updateVoteReady) {
            setLoading(true);
            const updatedVote = await updateVoteRequest(link, name, vote);
            setLoading(false);
            if (updatedVote.success === 'error') {
                setWarning("There was an error updating your vote");
                setUpdateVoteReady(true);
            } else {
                setWarning("");
                emitUpdate();
                setUpdateVoteReady(!updateVoteReady);
                console.log("updatedVote: ", updatedVote);
            }
        }
    }

    const toggleScreens = (link, toggle) => {
        if (canViewGroup) {
            if (groupScreen) {
                setTimeslotMembers([]);
            }
            setScreen(link, !toggle);
            setGroupScreen(!toggle);
        }
    }

    const selectLink = () => {
        textAreaRef.current.select();
        document.execCommand('copy');
        setTextCopied(true);
        setBounce(true);
        setTimeout(() => {
            setTextCopied(false);
            setBounce(false);
        }, 2000)
    }

    const seeMembers = (members, votes) => {
        setTimeslotMembers(members);
    }

    const formatMembers = (members, limit) => {
        let endString = "";
        if (members.length > limit) {
            let remainingMembers = members.length - limit;
            members = members.slice(0, limit);
            endString = 'and ' + remainingMembers + ' more..'
        }
        members.join(', ');
        return members + " " + endString;
    }

    const generateKey = () => {
        const key = shortid.generate();
        return key;
    }

    return (
        <div className="grid-container">
            <div className="grid-header">
                <a href="/">
                    <div className="logo-container-grid">
                        <Logo loading={loading} />
                    </div>
                </a>
                <div key={generateKey()} onClick={() => selectLink()} className={bounce ? "group-link bounce" : "group-link"}>
                    {textCopied ? <div class="link-copied">Link Copied</div> : ''}
                     <textarea readOnly ref={textAreaRef} value={`${window.location}`} />{groupLink} &nbsp; <FontAwesomeIcon icon={faLink} />
                </div>
                <div className="members-icon" onClick={() => setMembersPopup(!membersPopup)}><FontAwesomeIcon icon={faUsers} /><span>{groupMembers.length}</span></div>
            </div>

            <div className="timeslot-members">{formatMembers(timeslotMembers, 8)}</div>

            {membersPopup ?
                <div className="details-box">
                    {!privateGroup && !admin ? '' :
                        <div onClick={() => {setDeleteMembers(!deleteMembers)}} className={deleteMembers ? "delete-members delete-on" : "delete-members delete-off"}>Remove Members {deleteMembers ? "on" : "off"}</div>
                    }
                    <div onClick={() => {setMembersPopup(false)}} className="popup-close">x</div>
                    <div className="details-container">
                        <div className="details-box-members">
                            {groupMembers.map((member, i) =>
                                <div key={i} className="popup-member">
                                    <div className="popup-member-name">{member}</div>
                                    <div className="popup-member-delete">
                                        {!privateGroup && !admin ? '' :
                                            <div onClick={() => removeMember(groupLink, member, deleteMembers)} className="trash-icon" style={{color: deleteMembers ? '' : 'grey'}}><FontAwesomeIcon icon={faTrash} /></div>
                                        }
                                    </div>
                                </div>
                            )}
                        </div>
                        {/* {<div className="details-box-votes"><span>Votes:&nbsp;</span>{}</div>} */}
                    </div>
                </div> : ''
            }

            <div className="grid-days">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((item, i) => <div key={i}>{item}</div>)}
            </div>
            <div className="grid">
                <div className="grid-times">
                    {['8am', '', '9', '', '10', '', '11', '', '12', '', '1', '', '2', '', '3', '', '4', '', '5', '', '6', '', '7']
                    .map((item, i) => <div key={i}>{item}</div>)
                    }
                </div>
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
                        numOfMembers={groupMembers.length}
                        seeMembers={seeMembers}
                    />
                )}
            </div>
            {warning ? <div className="error">{warning}</div> : ''}
            <div className="grid-footer">
                <div className="footer-section">
                    <div style={canViewGroup ? {} : {color: 'lightgrey'}} className="switch-view-button footer-button" onClick={() => toggleScreens(groupLink, groupScreen)}>
                        <div>{groupScreen ? <FontAwesomeIcon icon={faChevronCircleLeft} /> : <FontAwesomeIcon icon={faChevronCircleRight} />}</div>
                        <div className="footer-text">View<br/>{groupScreen ? "Availability" : "Group"}</div>
                    </div>
                </div>

                <div className="footer-section">
                    {groupScreen
                        ? <div style={{color: updateVoteReady ? '' : 'lightgrey'}} className="update-button vote footer-button" onClick={() => updateVote(groupLink, userName, vote)}>
                            <div><FontAwesomeIcon icon={faStar} /></div>
                            <div className="footer-text">Update<br/>Vote</div>
                        </div>
                        : <div style={{color: updateAvailabilityReady ? '' : 'lightgrey'}} className="update-button availability footer-button" onClick={() => updateAvailability(groupLink, userName, availability)}>
                            <div><FontAwesomeIcon icon={faCalendarDay} /></div>
                            <div className="footer-text">Update<br/>Availability</div>
                        </div>
                    }
                </div>
                <div className="footer-section">
                    <div onClick={() => setChatOpen(false)} className="chat-icon footer-button">
                        <FontAwesomeIcon icon={faCommentDots} />
                        <br/>
                        <span className="footer-text">coming soon</span>
                    </div>
                </div>
            </div>
            {chatOpen ? <div className="chat-container">
                <button disabled={!message.length} onClick={() => sendMessage(message)}>Send Message</button>
                <input onChange={(e) => setMessage(e.target.value)} type="text" />
                <div onClick={() => setChatOpen(false)}>BACK</div>
            </div> : ''}
        </div>
    );
}

export default Grid;
