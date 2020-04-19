import React, {useState, useEffect} from 'react';

import {
    checkGroupRequest,
    createGroupRequest
} from '../requests.js';

const Home = () => {
    const [groupLink, setGroupLink] = useState("");
    const [name, setName] = useState("");
    const [warning, setWarning] = useState(false);

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
