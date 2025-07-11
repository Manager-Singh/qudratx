import React from "react";
import "./CardSelector.css"; 

const CardSelector = ({ selected, onClick, image, title }) => {
  return (
    <label className={`card`}>
      <input
        type="checkbox"
        className="card__input"
        checked={selected}
        onChange={onClick}
      />
      <div className="card__body">
        {image &&(
            <img src={image} alt="card" className="card__body-cover-image" />
        ) }
        <div className="card__body-cover">
          <div className="card__body-cover-checkbox">
            <svg className="card__body-cover-checkbox--svg" viewBox="0 0 12 10">
              <polyline points="1.5 6 4.5 9 10.5 1" />
            </svg>
          </div>
        </div>
        <div className="card__body-header">
          <div className="card__body-header-title">{title}</div>
        </div>
      </div>
    </label>
  );
};

export default CardSelector;
