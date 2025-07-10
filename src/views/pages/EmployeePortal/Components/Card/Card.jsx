// import React from "react";
// import PropTypes from "prop-types";
// import { CCard, CCardBody, CCardTitle, CCardText } from "@coreui/react";
// import "./Card.css"; // Custom styles (defined below)
// import logo from "../../../../../../public/download.png"; // Custom styles (defined below)

// const Card = ({ title, paragraph, backgroundImage, textAlign, onClick }) => {
//   const alignment = textAlign || "left"; // default is left
  
//   return (
//     <a href="#" className="">
//     <CCard className="mb-4 authorty-activity" style={cardStyle} onClick={onClick}>
//       <CCardBody className={`text-${alignment}`}>
//         <img src={logo} className="w-75 mt-2"/>
//         <CCardTitle className="card-heading">{title}</CCardTitle>
//         {paragraph && <CCardText className="fs-6">{paragraph}</CCardText>}
//       </CCardBody>
//     </CCard>
//     </a>
//   );
// };

// Card.propTypes = {
//   title: PropTypes.string.isRequired,
//   paragraph: PropTypes.string,
//   backgroundImage: PropTypes.string,
//   textAlign: PropTypes.oneOf(["left", "center", "right"]),
// };

// export default Card;

import React from "react";
import PropTypes from "prop-types";
import { CCard, CCardBody, CCardTitle, CCardText } from "@coreui/react";
import "./Card.css";


const Card = ({ title, paragraph, backgroundImage, textAlign, onClick }) => {
  const alignment = textAlign || "left"; // default is left
  const imageSrc = backgroundImage;

  return (
    <a href="#" className="">
      <CCard className="mb-4 authorty-activity" onClick={onClick}>
        <CCardBody className={`text-${alignment}`}>
          {/* Cover image on top */}
          {imageSrc &&(
            <img src={imageSrc} alt="Card cover"  className="w-75 mt-2" />
          ) }
          <CCardTitle className="card-heading">{title}</CCardTitle>
          {paragraph && <CCardText className="fs-6">{paragraph}</CCardText>}
        </CCardBody>
      </CCard>
    </a>
  );
};

Card.propTypes = {
  title: PropTypes.string.isRequired,
  paragraph: PropTypes.string,
  backgroundImage: PropTypes.string, // used as the card cover
  textAlign: PropTypes.oneOf(["left", "center", "right"]),
  onClick: PropTypes.func,
};

export default Card;
