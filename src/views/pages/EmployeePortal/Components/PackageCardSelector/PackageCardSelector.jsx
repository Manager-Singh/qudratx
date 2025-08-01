// import React from 'react';
// import '../CardSelector/CardSelector.css';
// import { FaCheck } from 'react-icons/fa';

// const PackageCardSelector = ({ item, selected, onClick }) => {
  
//   return (
//     <label className="card">
//      <input
//   type="radio"
//   name="package"
//   className="card__input"
//   checked={selected}
//   onChange={onClick}
// />
//       <div className="card__body rounded-2 overflow-hidden shadow">
//         <div className="card__body-cover">
//           <div
//             className="text-white text-center py-3"
//             style={{ backgroundColor: '#2f1051' }}
//           >
//             <h4 className="fw-bold mb-2">{item.name}</h4>
//              <h1 className="fw-bold mb-1 " style={{color:'#ff770f'}}>{`AED ${item.total_amount}`}</h1>
//           </div>

//           <div className="card__body-cover-checkbox">
//             <svg className="card__body-cover-checkbox--svg" viewBox="0 0 12 10">
//               <polyline points="1.5 6 4.5 9 10.5 1" />
//             </svg>
//           </div>
//         </div>

//         <div className="card__body-header p-3">
//             <p className='text-start'>Activity Offered: {item.activity}</p>
//           <ul className="list-unstyled m-0">
//             {item.fee_structure?.map((fee, index) => (
//               <li
//                 key={index}
//                 className="d-flex gap-2 align-items-center mb-2 text-start"
//               >
//                 <span className='text-success'>{`AED ${fee.amount}`}</span>
//                 {` ${fee.name}`}
//               </li>
//             ))}
//           </ul>
          
//           {item.discount >0  && <p className='text-start '> <span className='text-success me-1'>{`AED ${item.discount}`}</span>
//                 discount </p> }
//           {item.tax >0 &&  <p className='text-start'> <span className='text-success me-1'>{`AED ${item.tax}`}</span>
//                  tax</p>}
          
//         </div>
//       </div>
//     </label>
//   );
// };

// export default PackageCardSelector;

// import React from 'react'
// import './PackageCardSelector.css'
// import { FaCheckCircle } from 'react-icons/fa'

// const PackageCardSelector = ({ item, selected, onClick }) => {
//   return (
//     <div
//       className={`package-card p-3 rounded-4 shadow-sm position-relative ${
//         selected ? 'package-card-selected border-primary border-2' : 'border border-light'
//       }`}
//       onClick={onClick}
//       style={{ cursor: 'pointer', transition: 'all 0.3s ease-in-out' }}
//     >
//       <input
//         type="radio"
//         name="package"
//         className="d-none"
//         checked={selected}
//         onChange={() => {}}
//       />

//       {/* Header */}
//       <div className="text-center mb-3"  >
//         <h5 className="fw-semibold text-dark mb-1">{item.name}</h5>
//         <h2 className="fw-bold" style={{ color: '#ff770f' }}>
//           AED {item.total_amount}
//         </h2>
//       </div>

//       {/* Fee structure */}
//       <div className="mb-3">
//         <small className="text-muted">Activity Offered:</small>
//         <p className="mb-2 fw-medium">{item.activity}</p>
//         <ul className="list-unstyled">
//           {item.fee_structure?.map((fee, index) => (
//             <li
//               key={index}
//               className="d-flex justify-content-between text-muted mb-1"
//             >
//               <span>{fee.name}</span>
//               <span className="text-success">AED {fee.amount}</span>
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Badges */}
//       <div className="d-flex gap-2 flex-wrap">
//         {item.discount > 0 && (
//           <span className="badge bg-success-subtle text-success">
//             AED {item.discount} Discount
//           </span>
//         )}
//         {item.tax > 0 && (
//           <span className="badge bg-info-subtle text-info">
//             AED {item.tax} Tax
//           </span>
//         )}
//       </div>

//       {/* Selected Icon */}
//       {selected && (
//         <div className="position-absolute top-0 end-0 p-2">
//           <FaCheckCircle className="text-primary" size={24} />
//         </div>
//       )}
//     </div>
//   )
// }

// export default PackageCardSelector

import React from 'react'
import './PackageCardSelector.css'
import { FaCheckCircle } from 'react-icons/fa'

const PackageCardSelector = ({ item, selected, onClick }) => {
  return (
    <div
      className={`package-card rounded-4 shadow-sm position-relative overflow-hidden ${
        selected ? 'package-card-selected border-primary border-2' : 'border border-light'
      }`}
      onClick={onClick}
      style={{ cursor: 'pointer', transition: 'all 0.3s ease-in-out' }}
    >
      <input
        type="radio"
        name="package"
        className="d-none"
        checked={selected}
        onChange={() => {}}
      />

      {/* Header with purple background */}
      <div className="text-white text-center py-3 px-2" style={{ backgroundColor: '#2f1051' }}>
        <h5 className="fw-semibold mb-1">{item.name}</h5>
        <h2 className="fw-bold" style={{ color: '#ff770f' }}>
          AED {item.total_amount}
        </h2>
      </div>

      {/* Body content */}
      <div className="p-3 bg-white">
        <div className="mb-3">
          <small className="text-muted">Activity Offered:</small>
          <p className="mb-2 fw-medium">{item.activity}</p>
          <ul className="list-unstyled">
            {item.fee_structure?.map((fee, index) => (
              <li
                key={index}
                className="d-flex justify-content-between text-muted mb-1"
              >
                <span>{fee.name}</span>
                <span className="text-success">AED {fee.amount}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="d-flex gap-2 flex-wrap">
          {item.discount > 0 && (
            <span className="badge bg-success-subtle text-success">
              AED {item.discount} Discount
            </span>
          )}
          {item.tax > 0 && (
            <span className="badge bg-info-subtle text-info">
              AED {item.tax} Tax
            </span>
          )}
        </div>
      </div>

      {/* Selected Icon */}
      {selected && (
        <div className="position-absolute top-0 end-0 p-2">
          <FaCheckCircle className="text-primary" size={24} />
        </div>
      )}
    </div>
  )
}

export default PackageCardSelector



