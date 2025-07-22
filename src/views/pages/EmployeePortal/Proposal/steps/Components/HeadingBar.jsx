import React from "react";

const HeadingBar = ({ title, position = "left" }) => {
  return (
    <div
      style={{
        textAlign: position,
        background: "linear-gradient(to right, #2f1051, #ff7711)",
        color: "#fff",
        padding: "10px 20px"
      }}
    >
      <p style={{ margin: 0, fontWeight: "bold", fontSize: "18px" }}>
        {title}
      </p>
    </div>
  );
};

export default HeadingBar;
