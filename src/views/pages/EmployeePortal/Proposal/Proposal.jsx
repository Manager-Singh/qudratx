// import React from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import Card from "../Components/Card/Card";

// const authority = [
//   { id: "221", name: "North Zone Supervisor" },
//   { id: "222", name: "JAFZA Offshore" },
//   { id: "223", name: "RAK ICC" },
//   { id: "224", name: "Ajman Offshore" },
//   { id: "225", name: "DED Dubai" },
// ];

// const Proposal = () => {
//   const { id } = useParams(); // This is the parent ID
//   const navigate = useNavigate();

//   const handleCardClick = (authorityId) => {
    
//   };

//   return (
//     <>
//       <h1 className="text-center">Kindly Choose Your Authority</h1>
//       <div className="container">
//         <div className="row">
//           {authority.map((item, index) => (
//             <div
//               key={index}
//               className="col-3 shadow-md rounded-xl cursor-pointer"
//               onClick={() => handleCardClick(item.id)}
//             >
//               <Card title={item.name} textAlign="center" />
//             </div>
//           ))}
//         </div>
//       </div>
//     </>
//   );
// };

// export default Proposal;


import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Card from "../Components/Card/Card";

const authorityOptions = [
  { id: "221", name: "North Zone Supervisor" },
  { id: "222", name: "JAFZA Offshore" },
  { id: "223", name: "RAK ICC" },
  { id: "224", name: "Ajman Offshore" },
  { id: "225", name: "DED Dubai" },
];

const activityOptions = [
  { id: 1, name: "Consultancy" },
  { id: 2, name: "IT Services" },
  { id: 3, name: "Trading" },
  { id: 4, name: "Manufacturing" },
];

const questions = [
  "What is your company name?",
  "What is your estimated investment?",
  "Do you need office space?",
  "How many visas are required?",
  "Do you need bank assistance?",
];

const packageOptions = [
  { id: "p1", name: "Basic Package" },
  { id: "p2", name: "Standard Package" },
  { id: "p3", name: "Premium Package" },
];

const Proposal = () => {
  const { id } = useParams();
  const [step, setStep] = useState(1);

  const [selectedAuthority, setSelectedAuthority] = useState(null);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [answers, setAnswers] = useState(Array(questions.length).fill(""));
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedClient, setSelectedClient] = useState("");

  const handleActivityToggle = (id) => {
    setSelectedActivities((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    if (step < 6) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const generatePDF = () => {
    console.log({
      id,
      selectedAuthority,
      selectedActivities,
      answers,
      selectedPackage,
      selectedClient,
    });
    alert("PDF Generated (placeholder)");
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Proposal Form - Step {step}/6</h2>

      {step === 1 && (
        <>
          <h4>Select Authority</h4>
          <div className="row">
            {authorityOptions.map((item) => (
              <div
                key={item.id}
                className={`col-4 p-2 ${selectedAuthority === item.id ? "border border-primary" : ""}`}
                onClick={() => setSelectedAuthority(item.id)}
              >
                <Card title={item.name} textAlign="center" />
              </div>
            ))}
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <h4>Select Business Activities</h4>
          <div className="row">
            {activityOptions.map((item) => (
              <div
                key={item.id}
                className={`col-4 p-2 ${selectedActivities.includes(item.id) ? "border border-success" : ""}`}
                onClick={() => handleActivityToggle(item.id)}
              >
                <Card title={item.name} textAlign="center" />
              </div>
            ))}
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <h4>Business Questions</h4>
          {questions.map((q, idx) => (
            <div className="mb-3" key={idx}>
              <label>{q}</label>
              <input
                type="text"
                className="form-control"
                value={answers[idx]}
                onChange={(e) => {
                  const newAnswers = [...answers];
                  newAnswers[idx] = e.target.value;
                  setAnswers(newAnswers);
                }}
              />
            </div>
          ))}
        </>
      )}

      {step === 4 && (
        <>
          <h4>Select License Package</h4>
          <div className="row">
            {packageOptions.map((item) => (
              <div
                key={item.id}
                className={`col-4 p-2 ${selectedPackage === item.id ? "border border-warning" : ""}`}
                onClick={() => setSelectedPackage(item.id)}
              >
                <Card title={item.name} textAlign="center" />
              </div>
            ))}
          </div>
        </>
      )}

      {step === 5 && (
        <>
          <h4>Search & Select Client</h4>
          <input
            type="text"
            className="form-control"
            placeholder="Enter client name or ID"
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
          />
        </>
      )}

      {step === 6 && (
        <>
          <h4>Review & Generate PDF</h4>
          <p><strong>Authority:</strong> {selectedAuthority}</p>
          <p><strong>Activities:</strong> {selectedActivities.join(", ")}</p>
          <p><strong>Answers:</strong> {answers.join(" | ")}</p>
          <p><strong>Package:</strong> {selectedPackage}</p>
          <p><strong>Client:</strong> {selectedClient}</p>
          <button onClick={generatePDF} style={{ padding: "10px 20px", backgroundColor: "#28a745", color: "#fff" }}>
            Generate PDF
          </button>
        </>
      )}

      <div className="d-flex justify-content-between mt-4">
        {step > 1 && (
          <button onClick={handleBack} style={{ padding: "10px 20px", marginRight: "10px" }}>
            Back
          </button>
        )}
        {step < 6 && (
          <button onClick={handleNext} style={{ padding: "10px 20px" }}>
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default Proposal;
