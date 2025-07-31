import React from "react";

const ReusableInput = ({
  id,
  label,
  type = "text",
  placeholder = "",
  value,
  onChange,
  options = [],
  required = false,
   control,
  error,
}) => {
  return (
    <div className="mb-3">
      <label htmlFor={id} className="mb-1" style={{ fontWeight: 600 }}>
        {label}
      </label>
      <br />
      {type === "select" ? (
        <select
          id={id}
          className="underline-input-select"
          //   value={value}
          defaultValue=""
          onChange={onChange}
          required={required}
        >
          <option value="" disabled className="text-muted">
            {placeholder}
          </option>
          {options.map((opt, idx) => (
            <option key={idx} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          id={id}
          className="underline-input"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
        />
      )}
    </div>
  );
};

export default ReusableInput;
