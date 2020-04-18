import React, {useState} from 'react';
import './grid.css';

const Timeslot = ({index, selectTime, members, votes}) => {
    const [color, setColor] = useState(false);

    return (
        <div className={color ? 'green timeslot' : 'timeslot'} onClick={() => {selectTime(index); setColor(!color)}}>
            {members + " " + votes}
        </div>
    );
}

export default Timeslot;
