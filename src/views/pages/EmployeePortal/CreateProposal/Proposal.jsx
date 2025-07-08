import React from "react";
import { useParams } from "react-router-dom";
import Card from "../Components/Card/Card";

const authority = [
  { name: "North Zone Supervisor" },
  { name: "JAFZA Offshore" },
  { name: "RAK ICC" },
  { name: "Ajman Offshore" },
  { name: "DED Dubai" },
];

const Proposal = () => {
  const param = useParams();
  console.log(param.id);

  return (
    <>
      <h1 className="text-center">Kindly Choose Your Authority</h1>
      <div className="d-flex flex-wrap justify-content-center">
        {authority.map((item, index) => (
          <div key={index} className="bg-white shadow-md rounded-xl p-4 text-center">
            <Card title={item.name} textAlign="center"></Card>
          </div>
        ))}
      </div>
    </>
  );
};

export default Proposal;
