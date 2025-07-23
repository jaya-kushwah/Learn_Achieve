import React from "react";
import {
  Bars,
  Hearts,
  InfinitySpin,
  RotatingLines,
} from "react-loader-spinner";

const CustomLoader = ({
  height = 80,
  width = 80,
  color = "#4fa94d",
  message = "",
  //   wrapperStyle = {},
  //   wrapperClass = "",
}) => {
  return (
    <div
      className={`d-flex flex-column justify-content-center align-items-center`}
      //    ${wrapperClass}
      //   style={wrapperStyle}
    >
      <Bars
        height={height}
        width={width}
        color={color}
        ariaLabel="bars-loading"
        //   ariaLabel="rotating-lines-loading"
        //  ariaLabel="hearts-loading"
        //    ariaLabel="infinity-spin-loading"
        visible={true}
      />
      {message && (
        <span
          className="mt-2 fw-semibold text-muted"
          style={{ fontSize: "16px" }}
        >
          {message}
        </span>
      )}
    </div>
  );
};

export default CustomLoader;
