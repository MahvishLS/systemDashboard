import React from 'react';
import './Card.css';

const Card = ({ title, content, icon }) => {
    return (
        <div className="card">
            <span className="card-icon">{icon}</span>
            <h5 className="card-title">{title}</h5>
            <p className="card-text">{content}</p>


        </div>
    );
};

export default Card;