import React from "react";

const Pagination = ({ currentPage, totalPages, handleChange }) => {
  const handlePageChange = (pageNumber) => {
    handleChange(pageNumber);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const MAX_VISIBLE_PAGES = 5; // Số trang hiển thị tối đa

    // Tính toán khoảng trang hiển thị
    let startPage = Math.max(
      1,
      currentPage - Math.floor(MAX_VISIBLE_PAGES / 2)
    );
    let endPage = Math.min(totalPages, startPage + MAX_VISIBLE_PAGES - 1);

    // Đảm bảo số trang hiển thị là MAX_VISIBLE_PAGES
    if (endPage - startPage + 1 < MAX_VISIBLE_PAGES) {
      startPage = Math.max(1, endPage - MAX_VISIBLE_PAGES + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <li
          className={`page-item ${currentPage === i ? "active" : ""}`}
          key={i}
          onClick={() => handlePageChange(i)}
        >
          <button type="button" className="page-link border-0 rounded-2">
            {i}
          </button>
        </li>
      );
    }

    return pageNumbers;
  };

  return (
    <div className="d-flex align-items-center justify-content-center">
      <nav>
          <ul className="pagination pagination-sm">
            <li className="page-item">
              <button
                type="button"
                className="page-link border-0"
                onClick={() => handlePageChange(1)}
              >
                Trang đầu
              </button>
            </li>
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                type="button"
                className="page-link border-0"
                onClick={() => handlePageChange(currentPage - 1)}
              >
                <i className="fa-solid fa-angle-left"></i>
              </button>
            </li>
            {renderPageNumbers()}
            <li
              className={`page-item ${
                currentPage === totalPages || totalPages === 0 ? "disabled" : ""
              }`}
            >
              <button
                type="button"
                className="page-link border-0"
                onClick={() => handlePageChange(currentPage + 1)}
              >
                <i className="fa-solid fa-angle-right"></i>
              </button>
            </li>
            <li className="page-item">
              <button
                type="button"
                className="page-link border-0"
                onClick={() => handlePageChange(totalPages)}
              >
                Trang cuối
              </button>
            </li>
          </ul>
        </nav>
      
    </div>
  );
};

export default Pagination;
