import React, {useState, useEffect} from 'react';
import logo from '../assets/logo.png';
import '../home.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faSignInAlt } from '@fortawesome/free-solid-svg-icons';

import {
    checkGroupRequest,
    createGroupRequest
} from '../requests.js';

const Home = () => {
    const [groupLink, setGroupLink] = useState("");
    const [userName, setUserName] = useState("");
    const [warning1, setWarning1] = useState("");
    const [warning2, setWarning2] = useState("");
    const [privateGroup, setPrivateGroup] = useState(true);

    useEffect(() => {
        if (!localStorage.getItem("groups")) {
            localStorage.setItem("groups", "{}");
        }
    }, [])

    const formatLink = (words) => {
        const link = words.split(' ').join('-');
    }

    const checkGroup = async (link) => {
        const check = await checkGroupRequest(link);
        console.log(check);
        if (check.success) {
            window.location = `/${link}`;
        }
        else {
            setWarning2("Group does not exist");
        }
    }

    const createGroup = async (name, privateGroup) => {
        if (userName.length < 2) {
            setWarning1("Name must be at least 2 characters");
        }
        else {
            const group = await createGroupRequest(name, privateGroup);
            console.log(group);
            let groups = JSON.parse(localStorage.getItem("groups"));
            groups[group.group_link] = {'name': "", 'groupScreen': ""};;
            groups[group.group_link].name = name;
            groups[group.group_link].groupScreen = false;
            localStorage.setItem("groups", JSON.stringify(groups));
            window.location = group.group_link;
        }
    }

    return (
        <div className="home">
            <div className="logo-container"><img src={logo} alt="Unimeets" /></div>
            <h1>Unimeets</h1>
            <div className="home-form">
                {warning1 ? <div className="error">{warning1}</div> : ''}
                <input className="home-input" onChange={(e) => setUserName(e.target.value)} type="text" />
                <button className="main-btn create-group" onClick={() => createGroup(userName, privateGroup)}>Create Group &nbsp;<div className="users-icon"><FontAwesomeIcon icon={faSignInAlt} /></div></button>
                <br/><br/>
                {warning2 ? <div className="error">{warning2}</div> : ''}
                <input className="home-input" onChange={(e) => setGroupLink(e.target.value)} type="text" />
                <button className="main-btn join-group" onClick={() => checkGroup(groupLink)}>Join Group &nbsp;<div className="signin-icon"><FontAwesomeIcon icon={faUsers} /></div></button>
                <div>
                    <button className={privateGroup ? 'private group-type-button' : 'group-type-button'} onClick={() => setPrivateGroup(true)}>Private</button>
                    <button className={!privateGroup ? 'public group-type-button' : 'group-type-button'} onClick={() => setPrivateGroup(false)}>Public</button>
                </div>
            </div>
        </div>
    );
}


export default Home;
