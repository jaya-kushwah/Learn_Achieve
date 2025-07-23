import React, { useState } from "react";
import { Form } from "react-bootstrap";

const CustomInput = ({
  type = "text",
  label,
  icon,
  value,
  onChange,
  placeholder,
  showToggleIcon = false,
  onToggle,
  showPassword = false,
  controlId,
  marginLeft = "17%",
  highlightOnHover = false,
  height,
  width,
  error,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  //   const isActive = highlightOnHover && value;
  const isActive = highlightOnHover && (value || isHovered);
  const bgColor = isActive ? "#e8f0fe" : "#fff";

  return (
    <Form.Group
      className="mb-3 position-relative w-75"
      controlId={controlId}
      style={{ marginLeft }}
    >
      {label && <Form.Label className="fw-semibold">{label}</Form.Label>}

      <div
        className="input-group border rounded-3 overflow-hidden"
        style={{
          height: "8vh",
          backgroundColor: bgColor,
          transition: "background-color 0.3s ease",
        }}
        onMouseEnter={() => highlightOnHover && setIsHovered(true)}
        onMouseLeave={() => highlightOnHover && setIsHovered(false)}
      >
        <span
          className="input-group-text border-0"
          style={{
            backgroundColor: bgColor,
            transition: "background-color 0.3s ease",
          }}
        >
          {icon}
        </span>

        <Form.Control
          type={type}
          placeholder={placeholder}
          className="border-0 shadow-none fw-semibold"
          value={value}
          onChange={onChange}
          style={{
            fontWeight: "500",
            fontSize: "15px",
            backgroundColor: bgColor,
            transition: "background-color 0.3s ease",
            paddingRight: showToggleIcon ? "40px" : "12px",
          }}
        />

        {showToggleIcon && (
          <span
            onClick={onToggle}
            style={{
              position: "absolute",
              right: "8%",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              color: "#6c757d",
              userSelect: "none",
            }}
            title={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword}
          </span>
        )}
        {/* {error && (
          <div className="text-danger ms-2 mt-1" style={{ fontSize: "13px" }}>
            {error}
          </div>
        )} */}
        {/* {error && (
          <p 
            style={{
              color: "red",
              fontSize: "14px",
              marginTop: "9%",
              marginLeft: "9px",
            }}
          >
            {error}
          </p>
        )} */}
      </div>
            {error && (
          <div className="text-danger ms-2 mt-1" style={{ fontSize: "13px" }}>
            {error}
          </div>
        )}
    </Form.Group>
  );
};

export default CustomInput;
