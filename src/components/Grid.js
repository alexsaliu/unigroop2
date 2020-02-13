import React, { useState, useEffect } from 'react';
import './grid.css';
import Timeslot from './Timeslot.js';

const Grid = () => {
    const [timeSlots, setTimeSlots] = useState(['0', '0']);
    const [ok, setOk] = useState([]);

    useEffect(() => {
        renderGrid();
    }, [])

    const renderGrid = () => {
        let t = []
        for (let i = 0; i < 168; i++) {
            setTimeout(() => {
                setTimeSlots(ok.push(0));
                // setOk(ok => [...ok, 0]);
                console.log("OK", ok);
            }, 10 * i)
        }
    }

    return (
        <div className="grid-container">
            <div className="grid-days">

            </div>
            <div className="grid">
                {ok.map((item, i) =>  <Timeslot key={i} /> )}
            </div>
        </div>
    );
}

export default Grid;
