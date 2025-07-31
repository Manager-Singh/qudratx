import React from 'react';
import '../CardSelector/CardSelector.css';
import { FaCheck } from 'react-icons/fa';

const PackageCardSelector = ({ item, selected, onClick }) => {
  
  return (
    <label className="card">
     <input
  type="radio"
  name="package"
  className="card__input"
  checked={selected}
  onChange={onClick}
/>
      <div className="card__body rounded-2 overflow-hidden shadow">
        <div className="card__body-cover">
          <div
            className="text-white text-center py-3"
            style={{ backgroundColor: '#2f1051' }}
          >
            <h4 className="fw-bold mb-2">{item.name}</h4>
             <h1 className="fw-bold mb-1 " style={{color:'#ff770f'}}>{`AED ${item.total_amount}`}</h1>
          </div>

          <div className="card__body-cover-checkbox">
            <svg className="card__body-cover-checkbox--svg" viewBox="0 0 12 10">
              <polyline points="1.5 6 4.5 9 10.5 1" />
            </svg>
          </div>
        </div>

        <div className="card__body-header p-3">
            <p className='text-start'>Activity Offered: {item.activity}</p>
          <ul className="list-unstyled m-0">
            {item.fee_structure?.map((fee, index) => (
              <li
                key={index}
                className="d-flex gap-2 align-items-center mb-2 text-start"
              >
                <span className='text-success'>{`AED ${fee.amount}`}</span>
                {` ${fee.name}`}
              </li>
            ))}
          </ul>
          {item.discount >0  && <p className='text-start '> <span className='text-success me-1'>{`AED ${item.discount}`}</span>
                discount </p> }
          {item.tax >0 &&  <p className='text-start'> <span className='text-success me-1'>{`AED ${item.tax}`}</span>
                 tax</p>}
          
        </div>
      </div>
    </label>
  );
};

export default PackageCardSelector;
