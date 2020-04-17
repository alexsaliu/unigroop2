import React, {useState, useEffect} from 'react';

function Home() {
    const [groupLink, setGroupLink] = useState("");
    const [name, setName] = useState("");
    const [warning, setWarning] = useState(false);

    useEffect(() => {
        if (!localStorage.getItem("groups")) localStorage.setItem("groups", "{}");
    }, [])

    const formatLink = (words) => {
        const link = words.split(' ').join('-');
    }

    const checkGroup = (link) => {
        console.log(link);
        fetch('http://localhost:3001/check-group', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"link": link})
        })
        .then((response) => response.json())
        .then((data) => {
          console.log('Success:', data);
          if (!data.success) {
              setWarning(true);
          }
          else {
              window.location = `/${link}`;
          }
        })
        .catch((err) => console.log("Error: ", err))
    }

    const createGroup = (memberName) => {
        fetch('http://localhost:3001/create-group', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"name": memberName})
        })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          let groups = JSON.parse(localStorage.getItem("groups"));
        })
        .catch((err) => console.log("Error: ", err))
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
