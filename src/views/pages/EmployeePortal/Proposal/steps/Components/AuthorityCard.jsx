import React from "react";


const AuthorityCard = ({ checked, onChange, image, title ,name,activity_code ,type}) => {
  return (
    <label className={`card mt-3`}>
      <input
  type={type}
  name={name}
  className="card__input"
  checked={checked}
  onChange={onChange}
/>
      <div className="card__body">
  
        <div className="card__body-cover">
          <div className="card__body-cover-checkbox">
            <svg className="card__body-cover-checkbox--svg" viewBox="0 0 12 10">
              <polyline points="1.5 6 4.5 9 10.5 1" />
            </svg>
          </div>
        </div>
        <div className={image ? "img-div" : "tex-div"}>
          {image && (
            <img src={image} alt="card" className="card__body-cover-image img-fluid " />
          )}
        </div>
       <div className="w-100 text-center">
  <div className="text-primary fw-semibold ">{activity_code}</div>
  <div className="fw-bold text-dark mt-1" style={{ fontSize: '0.95rem' }}>
    {title}
  </div>
</div>
      </div>
    </label>
  );
};

export default AuthorityCard;
