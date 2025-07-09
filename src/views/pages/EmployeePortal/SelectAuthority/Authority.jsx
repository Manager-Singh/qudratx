// import React from "react";
// import { useParams } from "react-router-dom";
// import Card from "../Components/Card/Card";

// const authority = [
//   { name: "North Zone Supervisor" },
//   { name: "JAFZA Offshore" },
//   { name: "RAK ICC" },
//   { name: "Ajman Offshore" },
//   { name: "DED Dubai" },
// ];

// const Authority = () => {
//   const param = useParams();
//   console.log(param.id);

//   return (
//     <>
//       <h1 className="text-center">Kindly Choose Your Authority</h1>
//       <div className="container">
//       <div className="row">
//         {authority.map((item, index) => (
//           <div key={index} className="col-3 shadow-md rounded-xl">
//             <Card title={item.name} textAlign="center"></Card>
//           </div>
//         ))}
//       </div>
//       </div>
//     </>
//   );
// };

// export default Authority;

import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from "../Components/Card/Card";

const authority = [
  { id: "221", name: "North Zone Supervisor" },
  { id: "222", name: "JAFZA Offshore" },
  { id: "223", name: "RAK ICC" },
  { id: "224", name: "Ajman Offshore" },
  { id: "225", name: "DED Dubai" },
];

const Authority = () => {
  const { id } = useParams(); // This is the parent ID
  const navigate = useNavigate();

  const handleCardClick = (authorityId) => {
    navigate(`/authority/${id}/activity/${authorityId}`);
  };

  return (
    <>
      <h1 className="text-center">Kindly Choose Your Authority</h1>
      <div className="container">
        <div className="row">
          {authority.map((item, index) => (
            <div
              key={index}
              className="col-3 shadow-md rounded-xl cursor-pointer"
              onClick={() => handleCardClick(item.id)}
            >
              <Card title={item.name} textAlign="center" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Authority;

