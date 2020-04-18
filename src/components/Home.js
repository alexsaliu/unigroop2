import React, {useState, useEffect} from 'react';

import {
    checkGroupRequest,
    createGroupRequest
} from '../requests.js';

const Home = () => {
    const [groupLink, setGroupLink] = useState("");
    const [name, setName] = useState("");
    const [warning, setWarning] = useState(false);

    useEffect(() => {
        if (!localStorage.getItem("groups")) localStorage.setItem("groups", "{}");
    }, [])

    const formatLink = (words) => {
        const link = words.split(' ').join('-');
    }

    const checkGroup = async (link) => {
        const check = await checkGroupRequest(link);
        if (check.success) window.location = `/${link}`;
        setWarning(true);
    }

    const createGroup = async (memberName) => {
        const group = await createGroupRequest(memberName);
        console.log(group);
        let groups = JSON.parse(localStorage.getItem("groups"));
        groups[group.group_link] = {};
        groups[group.group_link]['name'] = name;
        localStorage.setItem("groups", JSON.stringify(groups));
        window.location = group.group_link;
    }

    return (
        <div className="home">
            Home
            <div style={warning ? {} : {display: 'none'}}>Group does not exist</div>
            <input onChange={(e) => setGroupLink(e.target.value)} type="text" />
            <button onClick={() => checkGroup(groupLink)}>Submit</button>
            <input onChange={(e) => setName(e.target.value)} type="text" />
            <button onClick={() => createGroup(name)}>Name</button>
        </div>
    );
}


export default Home;
