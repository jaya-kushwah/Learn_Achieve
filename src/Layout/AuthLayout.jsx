// import React from "react";
// import image from "../assets/Images/img.png";
// function AuthLayout({ children }) {
//   return (
//     <div>
//       <div className="login container ">
//         <div className="row h-100 ">
//           <div className="col-md-6 m-auto position-relative p-0 ">
//             <div><img className="image" src={image} alt="images" /></div>
//           </div>
//           <div className="col-md-6 m-auto p-0 ">{children}</div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AuthLayout;


import React from "react";
import image from "../assets/Images/img.png";

function AuthLayout({ children }) {
  return (
    <div className="login container">
      <div className="row w-100">
        <div className="col-md-6 d-none d-md-flex align-items-center justify-content-center">
          <img src={image} alt="auth-illustration" className="image" />
        </div>

        <div className="col-md-6  p-0 mt-2">
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
