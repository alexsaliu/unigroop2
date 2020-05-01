import React from 'react';
import './logo.css';

const Logo = ({loading}) => {

    return (
        <div className={loading ? "logo spin" : 'logo'}>
            <div className="logo-shadow"></div>
            <div className="logo-line green"></div>
            <div className="logo-line blue"></div>
            <div className="logo-line yellow"></div>
            <div className="logo-line red"></div>
            {loading ? <div className="loading">Loading...</div> : ''}
        </div>
    );
}

export default Logo;
