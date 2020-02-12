import React, { useState } from 'react';
import './grid.css';
import Timeslot from './Timeslot.js';

const Grid = () => {
    const [timeSlots, setTimeSlots] = useState(98);

    const renderGrid = () => {
        const grid = [];
        for (let i = 0; i < 168; i++) {
            grid.push(<Timeslot />);
        }
        return grid;
    }

    return (
        <div className="grid-container">
            <div className="grid-days">

            </div>
            <div className="grid">
                {renderGrid()}
            </div>
        </div>
    );
}

export default Grid;
