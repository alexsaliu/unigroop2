import React, {useState, useEffect} from 'react';

import {
    checkGroupRequest,
    createGroupRequest
} from '../requests.js';

const Home = () => {
    const [groupLink, setGroupLink] = useState("");
    const [userName, setUserName] = useState("");
    const [warning, setWarning] = useState("");
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
            setWarning("Group does not exist");
        }
    }

    const createGroup = async (name, privateGroup) => {
        if (userName.length < 2) {
            setWarning("Name must be at least 2 characters");
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
            <div>Home</div>
            {warning ? <div>{warning}</div> : ''}
            <input onChange={(e) => setGroupLink(e.target.value)} type="text" />
            <button onClick={() => checkGroup(groupLink)}>Submit</button>
            <br/>
            <input onChange={(e) => setUserName(e.target.value)} type="text" />
            <button onClick={() => createGroup(userName, privateGroup)}>Name</button>
            <div onClick={() => setPrivateGroup(true)}>Private</div>
            <div onClick={() => setPrivateGroup(false)}>Public</div>
        </div>
    );
}


export default Home;
