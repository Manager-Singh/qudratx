import React from "react";
import Card from "../Components/Card/Card";

const Dashboard =()=> {
    return (
     <div className="container">
        {/* section 1 */}
        <div className="d-flex justify-content-around mb-5">
             {/* Welcome card */}
            <Card
                title="Welcome Employee"
                paragraph="Discover services tailored to your needs with expert guidance and support."
                // backgroundImage="https://via.placeholder.com/600x300"
                textAlign="center"
            />

            {/* Notes card */}
            <Card
                title="Notes"
                paragraph="Discover services tailored to your needs withDiscover services tailored to your needs withDiscover services tailored to your needs withDiscover services tailored to your needs withDiscover services tailored to your needs with expert guidance and support."
                // backgroundImage="https://via.placeholder.com/600x300"
                textAlign="center"
            />
        </div>
       
        {/* Section 2 */}
        
     </div>
    )
}

export default Dashboard;