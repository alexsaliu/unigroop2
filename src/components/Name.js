import React, { useState, useEffect } from 'react';
import './grid.css';
import Grid from './Grid.js';

import {
    checkGroupRequest,
    joinGroupRequest
} from '../requests.js';

const Name = () => {
    const [groupLink, setGroupLink] = useState("");
    const [nameInput, setNameInput] = useState("");
    const [promptName, setPromptName] = useState(true);
    const [userName, setUserName] = useState("");
    const [checkingGroup, setCheckingGroup] = useState(true);

    useEffect(() => {
        let link = window.location.pathname;
        link = link.split('/')[1];
        const checkGroup = async () => {
            const check = await checkGroupRequest(link);
            console.log("Group Check: ", check);
            if (!check.success) window.location = '/';
            setGroupLink(link);
            setCheckingGroup(false);
            handelName(link);
        }
        checkGroup();
    }, [])

    const handelName = (link) => {
        if (!localStorage.getItem("groups")) {
            localStorage.setItem("groups", "{}");
            setPromptName(true);
        }
        else {
            let groups = JSON.parse(localStorage.getItem("groups"));
            if (groups[link]) {
                setUserName(groups[link]);
                setPromptName(false);
            }
            else {
                setPromptName(true);
            }
        }
    }

    const handelSettingName = async (link, name) => {
        let groups = JSON.parse(localStorage.getItem("groups"));
        groups[link] = name;
        localStorage.setItem("groups", JSON.stringify(groups));
        setUserName(nameInput);
        const joinedGroup = await joinGroupRequest(link, name);
        if (joinedGroup.success) {
            setPromptName(false);
        }
    }

    if (checkingGroup) {
        return (
            <div>Loading...</div>
        );
    }
    else if (promptName) {
        return (
            <div>
                <input onChange={(e) => setNameInput(e.target.value)} type="text" />
                <button onClick={() => handelSettingName(groupLink, nameInput)}>Submit Name</button>
            </div>
        );
    }
    else {
        return (
            <div>
                <Grid groupLink={groupLink} userName={userName} />
            </div>
        );
    }
}

export default Name;
