import React, { useState, useEffect } from 'react';
import './grid.css';
import Timeslot from './Timeslot.js';

const Grid = () => {
    // const [timeSlots, setTimeSlots] = useState(['0', '0']);
    const [timeSlots, setTimeSlots] = useState([]);

    useEffect(() => {
        let path = window.location.pathname;
        path = path.split('/')[1]
        fetch('http://localhost:3001/check-group', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({"link": path})
        })
        .then((response) => response.json())
        .then((data) => {
          console.log('Success:', data);
          if (!data.success) {
              window.location = '/';
          }
          else {
              renderGrid();
          }
        })
        .catch((err) => console.log("Error: ", err))
    }, [])

    const renderGrid = () => {
        let t = []
        for (let i = 0; i < 168; i++) {
            setTimeout(() => {
                setTimeSlots(timeSlots => [...timeSlots, 0]);
                // console.log("OK", timeSlots);
            }, 10 * i)
        }
    }

    const selectTime = (index) => {
        let availability = timeSlots;
        availability[index] = !availability[index];
        setTimeSlots(availability);
    }

    return (
        <div className="grid-container">
            <div className="grid-days">

            </div>
            <div className="grid">
                {timeSlots.map((item, i) =>  <Timeslot key={i} index={i} selectTime={selectTime} /> )}
            </div>
        </div>
    );
}

export default Grid;
