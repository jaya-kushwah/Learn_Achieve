import React from "react";

const PaginationButton = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <nav>
      <ul style={{marginLeft:"5%"}} className="custom-pagination justify-content-center my-4">
        <li className={`custom-page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button className="custom-page-link" onClick={handlePrev}>
            Prev
          </button>
        </li>

        {[...Array(totalPages)].map((_, i) => (
          <li
            key={i}
            className={`custom-page-item ${currentPage === i + 1 ? "active" : ""}`}
          >
            <button className="custom-page-link" onClick={() => onPageChange(i + 1)}>
              {i + 1}
            </button>
          </li>
        ))}

        <li
          className={`custom-page-item ${currentPage === totalPages ? "disabled" : ""}`}
        >
          <button className="custom-page-link" onClick={handleNext}>
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default PaginationButton;
