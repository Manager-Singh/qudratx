import React from "react";
import PropTypes from "prop-types";
import { CCard, CCardBody, CCardTitle, CCardText } from "@coreui/react";
import "./Card.css"; // Custom styles (defined below)

const Card = ({ title, paragraph, backgroundImage, textAlign, onClick }) => {
  const alignment = textAlign || "left"; // default is left
  const cardStyle = backgroundImage
    ? {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "#fff",
        minHeight: "250px",
      }
    : {};

  return (
    <CCard className="custom-card" style={cardStyle} onClick={onClick}>
      <CCardBody className={`text-${alignment}`}>
        <CCardTitle className="fs-4 fw-bold mb-3">{title}</CCardTitle>
        {paragraph && <CCardText className="fs-6">{paragraph}</CCardText>}
      </CCardBody>
    </CCard>
  );
};

Card.propTypes = {
  title: PropTypes.string.isRequired,
  paragraph: PropTypes.string,
  backgroundImage: PropTypes.string,
  textAlign: PropTypes.oneOf(["left", "center", "right"]),
};

export default Card;
