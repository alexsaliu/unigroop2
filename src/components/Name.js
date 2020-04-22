import React, { useState, useEffect } from 'react';
import './grid.css';
import Grid from './Grid.js';
import { randomNameGenerator } from '../helpers.js';
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
    const [groupScreen, setGroupScreen] = useState(false);
    const [privateGroup, setPrivateGroup] = useState(true);
    const [warning, setWarning] = useState("");

    useEffect(() => {
        let link = window.location.pathname;
        link = link.split('/')[1];
        const checkGroup = async () => {
            const check = await checkGroupRequest(link);
            console.log("Group Check: ", check);
            if (!check.success) window.location = '/';
            setGroupLink(link);
            setCheckingGroup(false);
            if (!check.privateGroup) setPrivateGroup(false);
            console.log("PRIVATE :", check.privateGroup);
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
                setUserName(groups[link].name);
                setGroupScreen(groups[link].groupScreen);
                setPromptName(false);
            }
            else {
                setPromptName(true);
            }
        }
    }

    const handelSettingName = async (link, name, privateGroup) => {
        if (!privateGroup && !name) {
            setWarning("Click above to generate a name");
        }
        else if (name.length < 2) {
            setWarning("Name must be at least 2 characters");
        }
        else {
            let groups = JSON.parse(localStorage.getItem("groups"));
            groups[link] = {'name': "", 'groupScreen': ""};
            groups[link].name = name;
            groups[link].groupScreen = false;
            setGroupScreen(false);
            localStorage.setItem("groups", JSON.stringify(groups));
            setUserName(nameInput);
            const joinedGroup = await joinGroupRequest(link, name, privateGroup);
            if (joinedGroup.success) {
                setPromptName(false);
            }
            console.log(joinedGroup);
        }
    }

    const generateName = () => {
        const name = randomNameGenerator();
        setNameInput(name);
    }

    if (checkingGroup) {
        return (
            <div>Loading...</div>
        );
    }
    else if (promptName) {
        return (
            <div>
                {privateGroup ?
                    <input onChange={(e) => setNameInput(e.target.value)} type="text" /> :
                    <div onClick={() => generateName()}>{!nameInput ? 'Generate Name' : nameInput}</div>
                }
                {warning ? <div>{warning}</div> : ''}
                <button onClick={() => handelSettingName(groupLink, nameInput, privateGroup)}>Submit Name</button>
            </div>
        );
    }
    else {
        return (
            <div>
                <Grid groupLink={groupLink} userName={userName} screen={groupScreen} privateGroup={privateGroup} />
            </div>
        );
    }
}

export default Name;
